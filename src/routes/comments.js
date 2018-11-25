const KoaRouter = require('koa-router');
const router = new KoaRouter();
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');

router.post('comments-create', '/', async (ctx) => {
    try {

        switch (ctx.accepts(['html', 'json'])) {
            
            case 'json':
                const jsonObject = JSON.parse(ctx.request.body);
                const comment1 = await ctx.orm.comment.create({
                    description: jsonObject.description,
                    userId: jsonObject.userId,
                    publicationId: jsonObject.publicationId,
                });
                await comment1.save();
                ctx.body = comment1;
                break;

            case 'html':
                const comment = ctx.orm.comment.build(ctx.request.body);
                await comment.save(ctx.request.body);
                ctx.flashMessage.notice = 'Comentario creado exitosamente';
                ctx.redirect(ctx.router.url('publications-show', ctx.params.pid));
                break;

            default:
                break;
        }
    }
    catch (error) {
        if (!isValidationError(error)) throw error;
        const users = await ctx.orm.user.findAll();
        const publication = await ctx.orm.publication.findById(ctx.params.pid);
        const { user } = ctx.state;
        const comments = await publication.getComments();
        await ctx.render('publications/show', {
            errors: getFirstErrors(error),
            users,
            publication,
            user,
            comments,
            newBidPath: ctx.router.url('bids-new', publication.id),
            publicationEditPath: ctx.router.url('publications-edit', publication.id),
            publicationDeletePath: ctx.router.url('publications-destroy', publication.id),
            publicationPicturePath: ctx.router.url('publications-show-picture', publication.id),
            submitPath: ctx.router.url('comments-create', publication.id),
        });
    }
});

router.get('comments-edit', '/:id/edit', async (ctx) => {
    const { comment } = ctx.state;
    const categories = await ctx.orm.category.findAll();

    return ctx.render(
        'comments/edit',
        {
            comment,
            categories,
            submitPath: ctx.router.url('comments-update', comment.id),
        },
    );
});

router.patch('comments-update', '/:id', async (ctx) => {
    ctx.body = await ctx.state.comment.update(
        ctx.request.body,
        { fields: ['title', 'description', 'logo', 'value', 'categoryId', 'exchange_type'] },
    );
});

router.delete('comments-destroy', '/:id', async (ctx) => {
    await ctx.state.comment.destroy();
    ctx.redirect(ctx.router.url('comments'));
});


router.get('comments', '/', async (ctx) => {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
    const comments = await publication.getComments()

    switch (ctx.accepts(['html', 'json'])) {
        case 'json':
            ctx.body = { comments: comments };
            break;

        default:
            break;
    }

});

module.exports = router;
