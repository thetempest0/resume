//基础模块
var gulp=require('gulp');
//webserver服务器模块
var webserver=require('gulp-webserver');
var url=require('url');
var fs=require('fs');
var sass=require('gulp-sass');
var webpack=require('gulp-webpack');
var named=require('vinyl-named');
var uglify=require('gulp-uglify');
var minifyCss=require('gulp-minify-css');
var rev=require('gulp-rev');
var revCollector=require('gulp-rev-collector');
var watch=require('gulp-watch');
var sequence=require('gulp-watch-sequence');


gulp.task('copy-index',function () {
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./www'));
});
gulp.task('images',function () {
	return gulp.src('./src/images/**')
	.pipe(gulp.dest('./www/images'));
});
gulp.task('font',function () {
	return gulp.src('./src/font/**')
	.pipe(gulp.dest('./www/font'));
});

gulp.task('webserver',function () {
	gulp.src('./www')
	.pipe(webserver({
		livereload:true,
		// directoryListing:true,
		open:true,
		middleware:function  (req,res,next) {
			//获取浏览器中的url，将url进行解析操作
			var urlObj=url.parse(req.url,true);
			method =req.method;
			switch(urlObj.pathname){
				case '/skill':
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/skill.json','utf-8',function (err,data) {
						res.end(data);
					});

				return;
				case '/project':
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/project.json','utf-8',function (err,data) {
						res.end(data);
					});

				return;
				case '/work':
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/work.json','utf-8',function (err,data) {
						res.end(data);
					});

				return;
			}
			// console.log(urlObj);
			next(); //next是实现的循环
		}  // end middleware
	}));  // end gulp
})
gulp.task('watch',function () {
	gulp.watch('./src/index.html',['copy-index']);
	gulp.watch('./src/styles/index.scss',['sass']);
	gulp.watch('./src/scripts/index.js',['packjs']);
//	var queue =sequence(300);
//	watch('./src/scripts/**/*.js',{
//		name:"JS",
//		emitOnGlob:false
//	},queue.getHandler('packjs','verJs','html'));
//	watch('./src/styles/**',{
//		name:"CSS",
//		emitOnGlob:false
//	},queue.getHandler('packjs','verCss','html'));
})
gulp.task('default',['webserver','watch']);

gulp.task('sass',function () {
	return gulp.src('./src/styles/index.scss').pipe(sass())
	.pipe(minifyCss())
	.pipe(gulp.dest('./www/css'));
});
gulp.task('packjs',function(){
	return gulp.src('./src/scripts/index.js')
	.pipe(named())
	.pipe(webpack())
	.pipe(uglify())
	.pipe(gulp.dest('./www/js'))
	
});

//var cssDistFiles=['./www/css/index.css'];
//var jsDistFiles=['./www/js/index.js'];

//gulp.task('verCss',function () {
//	return gulp.src(cssDistFiles)
//	.pipe(rev())
//	.pipe(gulp.dest('./www/css'))
//	.pipe(rev.manifest())
//	.pipe(gulp.dest('./www/ver/css'));
//})
//gulp.task('verJs',function () {
//	return gulp.src(jsDistFiles)
//	.pipe(rev())
//	.pipe(gulp.dest('./www/js'))
//	.pipe(rev.manifest())
//	.pipe(gulp.dest('./www/ver/js'));
//})

gulp.task('html',function () {
	gulp.src(['./www/ver/**/*.json','./www/*.html'])
	.pipe(revCollector({
		replaceReved:true
	}))
	.pipe(gulp.dest('./www'))
})