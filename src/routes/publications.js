const KoaRouter = require('koa-router');
const cloudStorage = require('../lib/cloud-storage');
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');


const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
    const publication = await ctx.orm.publication.findById(ctx.params.id);
    ctx.assert(publication, 404);
    ctx.state.publication = publication;
    return next();
});

router.get('publications', '/', async (ctx) => {

    const publications = await ctx.orm.publication.findAll({
        where: {
            status: 'open',
        },
        order: [
            ['updatedAt', 'DESC'],
        ]
    });
    const categories = await ctx.orm.category.findAll();
    const users = await ctx.orm.user.findAll();


    switch (ctx.accepts(['html', 'json'])) {
        case 'json':
            ctx.body = { publication: publications };
            break;
        case 'html':
            await ctx.render('publications/index', {
                title: "Publicaciones",
                publications,
                categories,
                users,
                newPublicationPath: ctx.router.url('publications-new'),
                getShowPath: publication => ctx.router.url('publications-show', publication.id),
                getEditPath: publication => ctx.router.url('publications-edit', publication.id),
                getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
                getPicturePath: publication => ctx.router.url('publications-show-picture', publication.id),
                getUserPath: user => ctx.router.url('users-show', user.id),
                newBidPath: publication => ctx.router.url('bids-new', publication.id),
            });
            break;

        default:
            break;
    }
});

router.get('publications-new', '/new', async (ctx) => {
    const categories = await ctx.orm.category.findAll();
    const users = await ctx.orm.user.findAll();

    return ctx.render('publications/new', {
        publication: ctx.orm.publication.build(),
        categories,
        users,
        submitPath: ctx.router.url('publications-create'),
    });
});

router.post('publications-create', '/', async (ctx) => {
    const publication = ctx.orm.publication.build(ctx.request.body);
    try {
        await publication.save(ctx.request.body);
        const { path: localPicturePath, name: localPictureName } = ctx.request.files.picture;
        if (localPictureName) {
            const remotePicturePath = cloudStorage.buildRemotePath(localPictureName, { directoryPath: 'publications/pictures', namePrefix: publication.id });
            await cloudStorage.upload(localPicturePath, remotePicturePath);
            await publication.update({ picture: remotePicturePath });
        }
        ctx.flashMessage.notice = 'Publicación creada exitosamente';
        ctx.redirect(ctx.router.url('publications'));
    } catch (error) {
        if (!isValidationError(error)) throw error;
        const users = await ctx.orm.user.findAll();
        const categories = await ctx.orm.category.findAll();
        await ctx.render('publications/new', {
            publication,
            errors: getFirstErrors(error),
            submitPath: ctx.router.url('publications-create'),
            categories,
            users,
        });
    }
});

router.get('publications-search', '/query', async (ctx) => {
    console.log(ctx.request.body)
    const text = ctx.request.url.slice(26)
    const categories = await ctx.orm.category.findAll();
    const users = await ctx.orm.user.findAll();
    const publications = await ctx.orm.publication.findAll({ where: { $or: [{ description: { $ilike: '%' + text + '%' } }, { title: { $ilike: '%' + text + '%' } }] } });

    return ctx.render('publications/index', {
        title: "Resultados de la busqueda",
        publications,
        categories,
        users,
        newPublicationPath: ctx.router.url('publications-new'),
        getShowPath: publication => ctx.router.url('publications-show', publication.id),
        getEditPath: publication => ctx.router.url('publications-edit', publication.id),
        getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
        newBidPath: publication => ctx.router.url('bids-new', publication.id),
        getUserPath: user => ctx.router.url('users-show', user.id),
        getPicturePath: publication => ctx.router.url('publications-show-picture', publication.id),
    });
});


router.get('publications-show', '/:id', async (ctx) => {
    const { publication } = ctx.state;
    const users = await ctx.orm.user.findAll();
    const comments = await publication.getComments()
    const { user } = ctx.state;
    const bidsCount = await ctx.orm.bid.count({
        where: {
            publicationId: publication.id,
        }
    })

    switch (ctx.accepts(['html', 'json'])) {
        case 'json':
            ctx.body = { publication: publication };
            break;
        case 'html':
            await ctx.render('publications/show',
                {
                    users,
                    publication,
                    user,
                    comments,
                    bidsCount,
                    newBidPath: ctx.router.url('bids-new', publication.id),
                    publicationBidsPath: ctx.router.url('publications-bid', publication.id),
                    publicationEditPath: ctx.router.url('publications-edit', publication.id),
                    publicationDeletePath: ctx.router.url('publications-destroy', publication.id),
                    publicationPicturePath: ctx.router.url('publications-show-picture', publication.id),
                    submitPath: ctx.router.url('comments-create', publication.id),
                });
            break;

        default:
            break;
    }


});

router.get('publications-show-picture', '/:id/picture', async (ctx) => {
    const { picture } = ctx.state.publication;
    if (/^https?:\/\//.test(picture)) {
        ctx.redirect(picture);
    } else {
        ctx.body = cloudStorage.download(picture);
    }
});


router.get('publications-edit', '/:id/edit', async (ctx) => {
    const { publication } = ctx.state;
    const categories = await ctx.orm.category.findAll();

    return ctx.render(
        'publications/edit',
        {
            publication,
            categories,
            submitPath: ctx.router.url('publications-update', publication.id),
        },
    );
});

router.patch('publications-update', '/:id', async (ctx) => {
    ctx.body = await ctx.state.publication.update(
        ctx.request.body, { fields: ['title', 'description', 'picture', 'value', 'categoryId', 'exchange_type'] });
    const { publication } = ctx.state;
    const users = await ctx.orm.user.findAll();
    const comments = await ctx.orm.comment.findAll({ where: { publicationId: publication.id } })
    user = await ctx.orm.user.find({ where: { id: publication.userId } });
    bids = await ctx.orm.bid.findAll({ where: { publicationId: publication.id } });
    return ctx.render('publications/show',
        {
            users,
            publication,
            user,
            bids,
            comments,
            users,
            newBidPath: ctx.router.url('bids-new', publication.id),
            publicationEditPath: ctx.router.url('publications-edit', publication.id),
            publicationDeletePath: ctx.router.url('publications-destroy', publication.id),
            publicationPicturePath: ctx.router.url('publications-show-picture', publication.id),
        });
});

router.delete('publications-destroy', '/:id', async (ctx) => {
    await ctx.state.publication.destroy();
    ctx.redirect(ctx.router.url('publications'));
});

router.get('publications-bid', '/:id/bids', async (ctx) => {
    const users = await ctx.orm.user.findAll();
    const bids = await ctx.state.publication.getBids();
    return ctx.render('publications/bids',
        {
            title: ctx.state.publication.title,
            users,
            bids,
            getUserPath: user => ctx.router.url('users-show', user.id),
            getAcceptBidPath: bid => ctx.router.url('bid-accept', bid.publicationId, bid.id),
        });
});

module.exports = router;
