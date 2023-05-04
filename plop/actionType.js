import { exec } from 'child_process';
import rimraf from 'rimraf';

export default {
	prettier: () => exec('yarn format & yarn lint'),
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
