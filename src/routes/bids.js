const KoaRouter = require('koa-router');
const router = new KoaRouter();
const sgMail = require('@sendgrid/mail');

router.param('id', async (id, ctx, next) => {
    const bid = await ctx.orm.bid.findById(ctx.params.id);
    ctx.assert(bid, 404);
    ctx.state.bid = bid;
    return next();
});

router.get('bids', '/', async (ctx) => {
    ctx.body = await ctx.orm.bid.findAll({
        where: {
            publicationId: ctx.params.pid
        }
    });
});

router.get('bids-new', '/new', async (ctx) => {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
    const receiver_user = await ctx.orm.user.findById(publication.userId);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return ctx.render('bids/new', {
        publication,
        receiver_user,
        error: false,
        currentUser: ctx.state.currentUser,
        bid: ctx.orm.bid.build(),
        submitPath: ctx.router.url('bids-create', publication.id),
    });
});

router.post('bids-create', '/', async (ctx) => {
    try {
        await ctx.orm.bid.create(ctx.request.body);
        ctx.redirect(ctx.router.url('publications'));
        const msg = {
            to: receiver_user.email,
            from: 'ofertas@tradein.com',
            subject: 'Has recibido una nueva oferta!',
            text: 'Hola, \n Al parecer a tu publicacion ' + publication.title + ' le está yendo muy bien \n Ingresa a nuestro sitio para ver la informacion del ofertante ',
        };
        sgMail.send(msg);
    }
    catch (error){
        const publication = await ctx.orm.publication.findById(ctx.params.pid);
        const receiver_user = await ctx.orm.user.findById(publication.userId);
        return ctx.render('bids/new', {
            publication,
            receiver_user,
            error: error,
            currentUser: ctx.state.currentUser,
            bid: ctx.orm.bid.build(),
            submitPath: ctx.router.url('bids-create', publication.id),
        });
    }
});

router.get('bids-edit', '/:id/edit', async (ctx) => {
    const { bid } = ctx.state;
    const categories = await ctx.orm.category.findAll();

    return ctx.render('bids/edit', {
        bid,
        categories,
        submitPath: ctx.router.url('bids-update', bid.id),
    });
});

router.delete('bids-destroy', '/:id', async (ctx) => {
    await ctx.state.bid.destroy();
    ctx.redirect(ctx.router.url('bids'));
});

router.patch('bid-accept', '/:id', async (ctx) => {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
    const publication_bids = await publication.getBids()

    const updatePromises = [];
    publication_bids.map(b => {
        updatePromises.push(
            b.update({ status: 'rejected' })
        );
    });
    await Promise.all(updatePromises);

    await publication.update(
        { status: 'closed' }
    );
    await ctx.state.bid.update(
        { status: 'accepted' }
    );
    ctx.redirect(ctx.router.url('bidder-info', ctx.state.bid.publicationId, ctx.state.bid.id));
});

router.get('bidder-info', "/:id", async (ctx) => {
    const bidder = await ctx.orm.user.findById(ctx.state.bid.bidderId);
    return ctx.render('bids/bidder-info', {
        bidder,
    });
});


module.exports = router;