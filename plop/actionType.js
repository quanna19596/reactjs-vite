import { execSync } from 'child_process';
import { rimraf } from 'rimraf';

export default {
	prettier: () => { execSync('yarn format & yarn lint', { stdio: 'ignore' }); },
	remove: (answers, config, plop) => {
    const { path } = config;
    const correctPath = plop.renderString(path, answers);
    rimraf.sync(correctPath);
  },
	removeMany: (answers, config, plop) => {
    const { paths } = config;
    paths.forEach((path) => {
      const correctPath = plop.renderString(path, answers);
      rimraf.sync(correctPath);
    });
  }
};
