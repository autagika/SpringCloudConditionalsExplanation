import { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Settings, Info, CheckCircle2, XCircle, RefreshCw, Cpu, Database, Server, Terminal } from 'lucide-react';
import { SimulatorState, AutoconfigResult } from '../types';

interface SandboxSimulatorProps {
  state: SimulatorState;
  onChangeState: (state: SimulatorState) => void;
}

export default function SandboxSimulator({ state, onChangeState }: SandboxSimulatorProps) {
  const [results, setResults] = useState<AutoconfigResult[]>([]);

  // Calculate Autoconfig status whenever sandbox state changes
  useEffect(() => {
    const calculateAutoconfigs = (): AutoconfigResult[] => {
      const list: AutoconfigResult[] = [];

      // 1. Tomcat Server Configuration
      const tomcatOnClasspath = state.classpath.tomcat;
      const webMvcOnClasspath = state.classpath.springWebMvc;
      const tomcatActive = tomcatOnClasspath && webMvcOnClasspath;

      list.push({
        name: "TomcatServletWebServerFactory",
        category: "Web Server",
        description: "Embedded Tomcat container configured to handle incoming HTTP requests on port 3000.",
        status: tomcatActive ? 'active' : 'inactive',
        conditions: [
          {
            name: "Tomcat Classpath Availability",
            type: "class",
            satisfied: tomcatOnClasspath,
            explanation: tomcatOnClasspath 
              ? "Found Tomcat startup libraries transitively in spring-boot-starter-tomcat."
              : "Missing Tomcat startup classes on JVM classpath."
          },
          {
            name: "Spring MVC Classpath Availability",
            type: "class",
            satisfied: webMvcOnClasspath,
            explanation: webMvcOnClasspath
              ? "Found DispatcherServlet on classpath."
              : "Missing spring-webmvc starter libraries."
          }
        ],
        consequence: tomcatActive 
          ? "Spins up embedded Tomcat listening on port 3000."
          : "Web server initialization bypassed."
      });

      // 2. DataSource Config (Hikari)
      const isHikariOnClasspath = state.classpath.hikariCP;
      const isDataSourceCustomDefined = state.customBeans.userDataSource;
      const isExcludeDataSource = state.properties.excludeDataSourceAutoConfig;
      const hasUrl = state.properties.datasourceUrl.trim().length > 0;
      const hasTypeMatch = state.properties.datasourceType === "com.zaxxer.hikari.HikariDataSource";

      const datasourceActive = isHikariOnClasspath && !isDataSourceCustomDefined && !isExcludeDataSource && hasUrl && hasTypeMatch;

      list.push({
        name: "HikariDataSource (Connection Pool)",
        category: "Database Pool",
        description: "High-performance connection pool that manages physical connections to the SQL database.",
        status: datasourceActive ? 'active' : 'inactive',
        conditions: [
          {
            name: "@ConditionalOnClass(HikariDataSource.class)",
            type: "class",
            satisfied: isHikariOnClasspath,
            explanation: isHikariOnClasspath 
              ? "Hikari connection pool classes detected on classpath."
              : "Hikari libraries are missing."
          },
          {
            name: "@ConditionalOnMissingBean(DataSource.class)",
            type: "missing-bean",
            satisfied: !isDataSourceCustomDefined,
            explanation: !isDataSourceCustomDefined 
              ? "No custom user-defined DataSource bean found. Safe to autoconfigure."
              : "User defined a custom @Bean public DataSource()! Auto-config backs off."
          },
          {
            name: "@ConditionalOnProperty(spring.datasource.url)",
            type: "property",
            satisfied: hasUrl,
            explanation: hasUrl 
              ? `datasourceUrl is set to: "${state.properties.datasourceUrl}"`
              : "Missing database URL property. DB driver cannot be initialized."
          },
          {
            name: "Not Excluded in @SpringBootApplication",
            type: "custom",
            satisfied: !isExcludeDataSource,
            explanation: !isExcludeDataSource 
              ? "DataSourceAutoConfiguration is active and included."
              : "Excluded explicitly via properties or SpringApplication config!"
          }
        ],
        consequence: datasourceActive 
          ? "Injects and registers HikariDataSource connection pool in Spring context."
          : "DataSource auto-registration skipped."
      });

      // 3. ReallyBigCompanyProprietaryFlywayClone
      const isOracleOnClasspath = state.classpath.oracleDriver;
      const isFlywayCloneCustomDefined = state.customBeans.userFlywayClone;
      const flywayActive = isOracleOnClasspath && hasUrl && !isFlywayCloneCustomDefined;

      list.push({
        name: "ReallyBigCompanyProprietaryFlywayClone",
        category: "Enterprise Shared Library",
        description: "ReallyBigCompany™ shared database migrator designed to automatically run on relational DB connections.",
        status: flywayActive ? 'active' : 'inactive',
        conditions: [
          {
            name: "IsRelationalDatabaseCondition: Oracle Driver",
            type: "class",
            satisfied: isOracleOnClasspath,
            explanation: isOracleOnClasspath 
              ? "Oracle JDBC driver driver classes are loaded on the JVM classpath."
              : "Oracle Driver missing. Not a relational database application."
          },
          {
            name: "IsRelationalDatabaseCondition: spring.datasource.url set",
            type: "property",
            satisfied: hasUrl,
            explanation: hasUrl 
              ? `Environment contains 'spring.datasource.url'.`
              : "Properties contain no datasource URL."
          },
          {
            name: "@ConditionalOnMissingBean(ReallyBigCompanyProprietaryFlywayClone.class)",
            type: "missing-bean",
            satisfied: !isFlywayCloneCustomDefined,
            explanation: !isFlywayCloneCustomDefined 
              ? "No override custom migration bean is specified."
              : "Custom FlywayClone bean defined by team. Backing off shared auto-config."
          }
        ],
        consequence: flywayActive 
          ? "Triggers proprietary DB migrations on startup."
          : "DB Migrations bypassed."
      });

      return list;
    };

    setResults(calculateAutoconfigs());
  }, [state]);

  const toggleClasspath = (key: keyof SimulatorState['classpath']) => {
    const updated = { ...state };
    updated.classpath[key] = !updated.classpath[key];
    onChangeState(updated);
  };

  const setProperty = (key: keyof SimulatorState['properties'], value: any) => {
    const updated = { ...state };
    updated.properties[key] = value as never;
    onChangeState(updated);
  };

  const toggleCustomBean = (key: keyof SimulatorState['customBeans']) => {
    const updated = { ...state };
    updated.customBeans[key] = !updated.customBeans[key];
    onChangeState(updated);
  };

  const resetSandbox = () => {
    onChangeState({
      classpath: {
        oracleDriver: false,
        hikariCP: true,
        tomcat: true,
        springWebMvc: true,
        flyway: false
      },
      properties: {
        datasourceUrl: '',
        datasourceType: 'com.zaxxer.hikari.HikariDataSource',
        excludeDataSourceAutoConfig: false
      },
      customBeans: {
        userDataSource: false,
        userFlywayClone: false
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900">Autoconfiguration Sandbox</h3>
            <p className="font-sans text-xs text-slate-500">Toggle dependencies & properties to see how Spring Boot evaluates @Conditionals live.</p>
          </div>
          <button
            onClick={resetSandbox}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left panel: Inputs & Controls */}
          <div className="space-y-6">
            {/* Classpath list */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h4 className="flex items-center space-x-1.5 font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Cpu className="h-4 w-4 text-slate-500" />
                <span>Classpath JVM Libraries</span>
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Toggle which library JARs are loaded into the classpath.</p>
              
              <div className="mt-4 space-y-2.5">
                {/* Tomcat toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-mono text-xs font-semibold text-slate-900">spring-boot-starter-tomcat</span>
                    <span className="block text-[10px] text-slate-500">Embedded Tomcat container files</span>
                  </div>
                  <button onClick={() => toggleClasspath('tomcat')} className="cursor-pointer">
                    {state.classpath.tomcat ? (
                      <ToggleRight className="h-7 w-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Spring web mvc toggle */}
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                  <div>
                    <span className="block font-mono text-xs font-semibold text-slate-900">spring-webmvc</span>
                    <span className="block text-[10px] text-slate-500">Enables MVC & Web server bootstrapping</span>
                  </div>
                  <button onClick={() => toggleClasspath('springWebMvc')} className="cursor-pointer">
                    {state.classpath.springWebMvc ? (
                      <ToggleRight className="h-7 w-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Hikari toggle */}
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                  <div>
                    <span className="block font-mono text-xs font-semibold text-slate-900">hikari-cp</span>
                    <span className="block text-[10px] text-slate-500">Hikari Database Connection Pool classes</span>
                  </div>
                  <button onClick={() => toggleClasspath('hikariCP')} className="cursor-pointer">
                    {state.classpath.hikariCP ? (
                      <ToggleRight className="h-7 w-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Oracle Driver toggle */}
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                  <div>
                    <span className="block font-mono text-xs font-semibold text-slate-900">oracle-jdbc-driver</span>
                    <span className="block text-[10px] text-slate-500">Enables connection to relational Oracle DBs</span>
                  </div>
                  <button onClick={() => toggleClasspath('oracleDriver')} className="cursor-pointer">
                    {state.classpath.oracleDriver ? (
                      <ToggleRight className="h-7 w-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Properties config panel */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h4 className="flex items-center space-x-1.5 font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-slate-500" />
                <span>application.properties</span>
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Customize properties that Spring Boot loads into the Environment.</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block font-mono text-xs font-semibold text-slate-700 mb-1">
                    spring.datasource.url
                  </label>
                  <input
                    type="text"
                    value={state.properties.datasourceUrl}
                    onChange={(e) => setProperty('datasourceUrl', e.target.value)}
                    placeholder="e.g. jdbc:oracle:thin:@localhost:1521:XE"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 mb-1">
                      spring.datasource.type
                    </label>
                    <select
                      value={state.properties.datasourceType}
                      onChange={(e) => setProperty('datasourceType', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="com.zaxxer.hikari.HikariDataSource">Hikari CP</option>
                      <option value="org.apache.tomcat.jdbc.Pool">Tomcat Pool</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end pb-1.5">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={state.properties.excludeDataSourceAutoConfig}
                        onChange={(e) => setProperty('excludeDataSourceAutoConfig', e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-sans text-[11px] text-slate-600">Exclude DataSourceAutoConfig</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom User Bean configuration */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h4 className="flex items-center space-x-1.5 font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Settings className="h-4 w-4 text-slate-500" />
                <span>Custom Beans (@Bean Override)</span>
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Define custom beans to see if Autoconfigurations back off.</p>

              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block font-sans text-xs font-semibold text-slate-800">User-Defined DataSource Bean</span>
                    <span className="block text-[10px] text-slate-500">@Bean public DataSource dataSource()</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.customBeans.userDataSource}
                    onChange={() => toggleCustomBean('userDataSource')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between border-t border-slate-200/50 pt-3 cursor-pointer">
                  <div>
                    <span className="block font-sans text-xs font-semibold text-slate-800">User-Defined Flyway Clone Bean</span>
                    <span className="block text-[10px] text-slate-500">Overrides custom shared initializer</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.customBeans.userFlywayClone}
                    onChange={() => toggleCustomBean('userFlywayClone')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right panel: LIVE CALCULATED OUTCOMES */}
          <div className="space-y-6">
            <h4 className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
              Live Spring Bean Context Status
            </h4>

            {results.map((res, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 shadow-sm transition-all ${
                  res.status === 'active'
                    ? 'border-indigo-200 bg-indigo-50/20'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      {res.category}
                    </span>
                    <h5 className="mt-1 font-sans font-bold text-sm text-slate-900">{res.name}</h5>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{res.description}</p>
                  </div>

                  <span className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                    res.status === 'active'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {res.status === 'active' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-indigo-700" />
                        <span>REGISTERED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-slate-400" />
                        <span>BACKED-OFF</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Conditional Rules Detail dropdown/section */}
                <div className="mt-4 border-t border-slate-100 pt-3.5 space-y-2.5">
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <Info className="h-3 w-3" />
                    <span>Evaluation Conditions</span>
                  </div>

                  {res.conditions.map((cond, cIdx) => (
                    <div key={cIdx} className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 text-xs">
                        <span className="mt-0.5">
                          {cond.satisfied ? (
                            <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                          )}
                        </span>
                        <div>
                          <span className="block font-mono text-[11px] text-slate-700 font-medium">
                            {cond.name}
                          </span>
                          <span className="block text-[10px] text-slate-500">{cond.explanation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consequence alert bar */}
                <div className={`mt-4 rounded-lg px-3 py-2 text-xs font-medium border ${
                  res.status === 'active'
                    ? 'bg-indigo-100/40 border-indigo-200/50 text-indigo-800'
                    : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <span className="font-semibold uppercase tracking-wider text-[10px] mr-1.5">Consequence:</span>
                  {res.consequence}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
