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
};

export default plopConfig;
