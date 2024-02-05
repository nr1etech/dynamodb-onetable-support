import {OneTableRepository} from './one-table.repository';

test('Test', () => {
  interface Test {
    id: string;
    name: string;
  }
  class TestRepository extends OneTableRepository<Test> {
    constructor() {
      super({
        schema: {
          format: 'onetable:1.1.0',
          version: '0.0.1',
          indexes: {
            primary: {
              hash: 'Pk',
              sort: 'Sk',
            },
          },
          models: {
            Test: {
              Pk: {type: String, value: 'Test#${Detail.id}'},
              Detail: {
                type: Object,
                required: true,
                schema: {
                  id: {type: String, required: true},
                  name: {type: String, required: true},
                },
              },
            },
          } as const,
          params: {
            isoDates: true,
            timestamps: true,
          },
        } as const,
        modelName: 'Test',
        tableName: 'test',
      });
    }
  }

  const testRepository = new TestRepository();
  expect(testRepository).toBeDefined();
});
