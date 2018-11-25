const KoaRouter = require('koa-router');


const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const category = await ctx.orm.category.findById(ctx.params.id);
  ctx.assert(category, 404);
  ctx.state.category = category;
  return next();
});

router.get('category-show', '/:id', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  const category = await ctx.orm.category.findById(ctx.params.id);
  const publications = await category.getPublications();
  const categories = [category];

  return ctx.render('publications/index', {
    title: category.name,
    publications,
    categories,
    users,
    newPublicationPath: ctx.router.url('publications-new'),
    getShowPath: publication => ctx.router.url('publications-show', publication.id),
    getEditPath: publication => ctx.router.url('publications-edit', publication.id),
    getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
    newBidPath: publication => ctx.router.url('bids-new', publication.id),
    getPicturePath: publication => ctx.router.url('publications-show-picture', publication.id),
  });
});

module.exports = router;
