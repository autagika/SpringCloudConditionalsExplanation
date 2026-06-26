export interface SimulatorState {
  classpath: {
    oracleDriver: boolean;
    hikariCP: boolean;
    tomcat: boolean;
    springWebMvc: boolean;
    flyway: boolean;
  };
  properties: {
    datasourceUrl: string;
    datasourceType: string;
    excludeDataSourceAutoConfig: boolean;
  };
  customBeans: {
    userDataSource: boolean;
    userFlywayClone: boolean;
  };
}

export interface AutoconfigResult {
  name: string;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  conditions: {
    name: string;
    type: 'class' | 'property' | 'missing-bean' | 'custom';
    satisfied: boolean;
    explanation: string;
  }[];
  consequence: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
