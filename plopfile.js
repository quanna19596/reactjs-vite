const COMPONENT_TYPE = { COMPONENTS: 'components', CONTAINERS: 'containers' };
const LAYOUT_TYPE = { PUBLIC: 'public', PRIVATE: 'private' };
const PAGE_TYPE = { PUBLIC: 'public', PRIVATE: 'private', COMMON: 'common' };
const BASE_PATH = './src';

const validationPrompts = ({ serviceDocType }) => {
  if (serviceDocType !== 'Postman') throw new Error('Wrong');
};

const plopConfig = (plop) => {
  plop.setGenerator('service', {
    description: 'Generate Service',
    prompts: [
      {
        type: 'list',
        name: 'serviceDocType',
        choices: ['Swagger', 'Postman'],
        message: 'Service Documentation Type?'
      },
      {
        type: 'input',
        name: 'serviceUrl',
        message: 'Service Url?'
      }
    ],
    actions: (data) => {
      validationPrompts(data);
      return [];
    }
  });
  plop.setGenerator('create-component', {
    description: 'Create Component',
    prompts: [
      {
        type: 'list',
        name: 'componentType',
        choices: Object.values(COMPONENT_TYPE),
        message: 'Component type?'
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name?'
      }
    ],
    actions: ({ componentType, componentName }) => {
      const dirPath = `${BASE_PATH}/${componentType}/${componentName}`;

      return [
        {
          type: 'addMany',
          path: `${dirPath}/{{componentName}}/index.ts`
        }
      ];
    }
  });
};

export default plopConfig;
