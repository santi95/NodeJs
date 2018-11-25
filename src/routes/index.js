const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const publications = await ctx.orm.publication.findAll({
    where: {
      status: 'open',
    },
    order: [
      ['updatedAt', 'DESC'],
  ],
    limit: 8
  });

  await ctx.render('index', {
    publications,
    appVersion: pkg.version,
    newUserPath: ctx.router.url('users-new'),
    getPicturePath: publication => ctx.router.url('publications-show-picture', publication.id),
  });
});


module.exports = router;
