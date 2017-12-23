import babel from 'rollup-plugin-babel'

const license = `/*!
 * InViewObserver
 * https://github.com/yomotsu/InViewObserver
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */`

export default {
	input: 'src/InViewObserver.js',
	output: [
		{
			file: 'dist/InViewObserver.js',
			format: 'umd',
			indent: '\t',
			name: 'InViewObserver',
			banner: license
		},
		{
			file: 'dist/InViewObserver.module.js',
			format: 'es',
			indent: '\t',
			banner: license
		}
	],
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
	]
};
