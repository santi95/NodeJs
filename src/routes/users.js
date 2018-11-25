const KoaRouter = require('koa-router');
const sgMail = require('@sendgrid/mail');
const Sequelize = require('sequelize');
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');
const cloudStorage = require('../lib/cloud-storage');

const Op = Sequelize.Op;
const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
    const user = await ctx.orm.user.findById(ctx.params.id);
    ctx.assert(user, 404);
    ctx.state.user = user;
    return next();
});

router.get('users', '/', async (ctx) => {
    const users = await ctx.orm.user.findAll();

    switch (ctx.accepts(['html', 'json'])) {
        case 'json':
            ctx.body = { users: users };
            break;
        case 'html':
            await ctx.render('users/index', {
                users,
                newUserPath: ctx.router.url('users-new'),
                getShowPath: user => ctx.router.url('users-show', user.id),
                getEditPath: user => ctx.router.url('users-edit', user.id),
                getDestroyPath: user => ctx.router.url('users-destroy', user.id),
            });
            break;

        default:
            break;
    }

});

router.get('users-new', '/new', ctx => ctx.render(
    'users/new',
    {
        user: ctx.orm.user.build(),
        submitPath: ctx.router.url('users-create'),
    },
));

router.post('users-create', '/', async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: user.email,
        from: 'bienvenida@tradein.com',
        subject: 'Gracias por unirte a Trade In',
        text: 'Bienvenido a la comunidad mas grande de trueques.',
    };
    sgMail.send(msg);
    try {
        await user.save(ctx.request.body);
        ctx.redirect(ctx.router.url('publications'));
    } catch (error) {
        if (!isValidationError(error)) throw error;
        await ctx.render('users/new', {
            user,
            errors: getFirstErrors(error),
            submitPath: ctx.router.url('users-create'),
        });
    }
});

router.get('users-show', '/:id', async (ctx) => {

    const { user } = ctx.state;
    const reviews = await ctx.orm.review.findAll({
        attributes: ['createdAt', 'score', 'feedback'],
        where: {
            receiverId: user.id,
        },
        include: [{
            model: ctx.orm.user,
            as: 'author',
            attributes: ['firstName', 'lastName'],
        }],
    });
    console.log(reviews);
    const up = await ctx.orm.review.count({
        where: {
            receiverId: user.id,
            score: 1,
        },
    });
    const down = await ctx.orm.review.count({
        where: {
            receiverId: user.id,
            score: -1,
        }
    });
    switch (ctx.accepts(['html', 'json'])) {
        case 'json':
            ctx.body = { users: user };
            break;
        case 'html':
            await ctx.render(
                'users/show',
                {
                    user,
                    up,
                    down,
                    reviews,
                    notice: ctx.flashMessage.notice,
                    newPublicationPath: ctx.router.url('publications-new'),
                    userPublications: ctx.router.url('users-show-publications', user.id),
                    userBids: ctx.router.url('users-bids', user.id),
                    userReceivedBids: ctx.router.url('users-received-bids', user.id),
                    userConcreted: ctx.router.url('users-concreted', user.id),
                    getProfilePicturePath: ctx.router.url('user-show-picture', user.id),
                },
            );
            break;

        default:
            break;
    }
});

router.get('users-edit', '/:id/edit', (ctx) => {
    const { user } = ctx.state;
    return ctx.render(
        'users/edit',
        {
            user,
            submitPath: ctx.router.url('users-update', user.id),
        },
    );
});
router.patch('users-update', '/:id', async (ctx) => {
    ctx.body = await ctx.state.user.update(
        ctx.request.body,
        { fields: ['name', 'location', 'role'] },
    );
});
router.delete('users-destroy', '/:id', async (ctx) => {
    await ctx.state.user.destroy();
    ctx.redirect(ctx.router.url('users'));
});

router.get('users-bids', '/:id/bids', async (ctx) => {
    const { user } = ctx.state;
    const bids = await ctx.orm.bid.findAll({ where: { bidderId: ctx.params.id } });
    const publications = await ctx.orm.publication.findAll()
    return ctx.render('users/my_bids', {
        user,
        bids,
        publications,
    });

});

router.get('users-received-bids', '/:id/received_bids', async (ctx) => {
    const { user } = ctx.state;
    const bids = await ctx.orm.bid.findAll({
        where: {
            receiverId: ctx.params.id
        }
    });
    const users = await ctx.orm.user.findAll();
    const publications = await ctx.orm.publication.findAll();
    return ctx.render('users/received_bids', {
        user,
        bids,
        publications,
        users,
        getUserPath: user => ctx.router.url('users-show', user.id),
        getAcceptBidPath: bid => ctx.router.url('bid-accept', bid.publicationId, bid.id),
    });
});

router.get('users-show-publications', '/:id/publications', async (ctx) => {
    const { user } = ctx.state;
    const publications = await ctx.orm.publication.findAndCountAll({
        where: {
            userId: user.id,
            status: 'open',
        },
    });
    if (publications.count === 0) {
        ctx.flashMessage.notice = 'No tienes ninguna publicación abierta';
        ctx.redirect(ctx.router.url('users-show', user.id));
    } else {
        const categories = await ctx.orm.category.findAll();
        return ctx.render('users/publications', {
            user,
            publications: publications.rows,
            categories,
            newPublicationPath: ctx.router.url('publications-new'),
            getShowPath: publication => ctx.router.url('publications-show', publication.id),
            getEditPath: publication => ctx.router.url('publications-edit', publication.id),
            getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
            getPicturePath: publication => ctx.router.url('publications-show-picture', publication.id),
            newBidPath: publication => ctx.router.url('bids-new', publication.id),
        });
    }
});

router.get('users-concreted', '/:id/concreted', async (ctx) => {
    const { user } = ctx.state
    const users = await ctx.orm.user.findAll();
    const publications = await user.getPublications();
    let concreted = await ctx.orm.bid.findAll({
        where: {
            [Op.or]: [{ bidderId: user.id }, { receiverId: user.id }],
            status: 'accepted',
        }
    })
    return ctx.render('users/concreted', {
        user,
        concreted,
        users,
        publications,
        getNewReviewPath: bid => ctx.router.url('reviews-new', bid.publicationId, bid.id),
    })
})

router.get('user-show-picture', '/:id/picture', async (ctx) => {
    const { picture } = ctx.state.user;
    if (/^https?:\/\//.test(picture)) {
        ctx.redirect(picture);
    } else {
        ctx.body = cloudStorage.download(picture);
    }
});

module.exports = router;
