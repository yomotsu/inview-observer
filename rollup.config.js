import babel from 'rollup-plugin-babel'

const license = `/*!
 * InViewObserver
 * https://github.com/yomotsu/InViewObserver
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */`

export default {
	entry: 'src/InViewObserver.js',
	indent: '\t',
	sourceMap: false,
	plugins: [
		babel( {
			exclude: 'node_modules/**',
			presets: [
				[ 'env', {
					targets: {
						browsers: [
							'last 2 versions',
							'ie >= 9'
						]
					},
					loose: true,
					modules: false
				} ]
			]
		} )
	],
	targets: [
		{
			format: 'umd',
			moduleName: 'InViewObserver',
			dest: 'dist/InViewObserver.js',
			banner: license
		},
		{
			format: 'es',
			dest: 'dist/InViewObserver.module.js',
			banner: license
		}
	]
};
