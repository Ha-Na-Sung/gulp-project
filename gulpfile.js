//Module 호출
var gulp = require('gulp'),
    csslint = require('gulp-csslint'), //css문법검사
    concatcss = require('gulp-concat-css'), //css 병합
    uglifycss = require('gulp-uglifycss'), // css 압축
    jshint = require('gulp-jshint'), // 자바스크립트 문법오류
    uglify = require('gulp-uglify'), //압축
    concat = require('gulp-concat'), // 파일저장
    rename = require('gulp-rename'), //압축,비압축파일출력
    gulpif = require('gulp-if'), // 조건에 따른 업무처리
    del = require('del'),
    config = require('./config.json');

    /* CSS
    * NPM 설치 모듈 : gulp-csslint,gulp-concat-css,gulp-uglifycss
    * 문법 검사 > 병합 > 압축 */
    //gulp.task('default', ['clean', 'styles', 'scripts']);
    //지속적 관찰(watch)업무 정의
    gulp.task('watch', ['clean'], function () {
      gulp.watch(config.css.src, ['styles']);
      gulp.watch(config.js.src, ['scripts']);
    });

    gulp.task('styles', function () { // 결과물 배포
        gulp.src(config.css.src)
            //문법검사
            .pipe(gulpif(config.lint, csslint({'import' : false})))
            //.pipe(gulpif(config.lint, csslint.reporter()) )
            //.pipe(csslint.reporter())
            //파일병합
            .pipe(gulpif(config.concat, concatcss(config.css.filename)))
            //압축하지 않은 파일 출력
            .pipe(gulpif(config.rename, gulp.dest(config.css.dest)))
            // 압축
            .pipe(gulpif(config.rename, uglifycss()))
            //압축한 파일 이름 바꿔 출력
            .pipe(gulpif(config.rename, rename({ suffix: '.min' })))
            .pipe(gulp.dest(config.css.dest));
    });


    /* 분리된 업무를 조합하여 실해할 새로운 업무 정의
    *  문법 검사 > 병합 > 압축 */
    gulp.task('scripts',['js:hint','js:concat','js:uglify']);


    //JS 문법검사
    gulp.task('js:hint', function () {
        gulp.src(config.js.src)
            .pipe(jshint())// 자바스크립트 문법오류
            .pipe(jshint.reporter('jshint-stylish'));// 자바스크립트 문법오류
    });

    //JS 병합
    gulp.task('js:concat', function () {
        gulp.src(config.js.src)
            .pipe(concat(config.js.filename)) //비압축파일
            .pipe(gulp.dest(config.js.dest));
    });

    //JS 압축
    gulp.task('js:uglify', function () {
        gulp.src(config.js.dest + config.js.filename)
            .pipe(uglify())
            .pipe(rename( { suffix: '.min' } ))//압축파일
            .pipe(gulp.dest(config.js.dest));
    });

    //폴더,파일제거
    gulp.task('clean', function () {
        del(['dist/*'])
    });

    //gulp.task()를 사용해 기본 (default) 테스크정의
   // gulp.task('default',['clean','scripts']);
    gulp.task('default', ['clean', 'styles', 'scripts']);
    /*gulp.task('default', function () {
        //콘솔(console)에 메시지 기록(log)
        console.log('gulp default 일이 수행 되었습니다.');
    });*/