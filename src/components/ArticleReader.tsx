import { useState, useEffect, useRef } from 'react';
import { BookOpen, Copy, Check, Sparkles, Database, Code, Sliders, Award } from 'lucide-react';
import { articleSections } from '../data/articleData';
import { SimulatorState } from '../types';

interface ArticleReaderProps {
  onApplySandboxConfig: (config: Partial<SimulatorState>) => void;
  onSectionVisible: (percentage: number) => void;
}

export default function ArticleReader({ onApplySandboxConfig, onSectionVisible }: ArticleReaderProps) {
  const [activeSection, setActiveSection] = useState('intro');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress to calculate reading percentage and active section
  useEffect(() => {
    const handleScroll = () => {
      const element = containerRef.current;
      if (!element) return;

      const totalHeight = element.scrollHeight - element.clientHeight;
      if (totalHeight <= 0) return;

      const currentScroll = element.scrollTop;
      const progress = Math.min((currentScroll / totalHeight) * 100, 100);
      onSectionVisible(progress);

      // Find active section based on heading positions
      const sections = articleSections.map((sec) => document.getElementById(`sec-${sec.id}`));
      let currentActive = 'intro';

      for (const sec of sections) {
        if (sec) {
          const rect = sec.getBoundingClientRect();
          // If the element is near the top of the container
          if (rect.top - 180 <= 0) {
            currentActive = sec.id.replace('sec-', '');
          }
        }
      }
      setActiveSection(currentActive);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onSectionVisible]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`sec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4.25rem)] w-full overflow-hidden bg-white">
      {/* Table of Contents Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-widest">Chapters</span>
        </div>
        <nav className="mt-6 space-y-2">
          {articleSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-all ${
                activeSection === section.id
                  ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-950 font-medium pl-2.5'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <span className={`font-sans text-xs ${
                activeSection === section.id ? 'text-indigo-700 font-bold' : 'text-slate-400 group-hover:text-indigo-600'
              }`}>
                {section.title}
              </span>
              <span className="mt-0.5 font-sans text-xs font-normal leading-relaxed text-slate-500 line-clamp-1 group-hover:text-slate-900">
                {section.short}
              </span>
            </button>
          ))}
        </nav>

        {/* Dynamic Tip Widget */}
        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div className="flex items-center space-x-2 text-indigo-800">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
            <h4 className="font-sans text-xs font-bold">Active Learning!</h4>
          </div>
          <p className="mt-2 font-sans text-xs leading-relaxed text-indigo-700/90">
            Whenever you see the <Sliders className="inline-block h-3 w-3 mx-0.5 text-indigo-600" /> icon in the text, click it to automatically load those classpath dependencies or properties into the sandbox.
          </p>
        </div>
      </aside>

      {/* Main Reading Window */}
      <div
        id="article-container"
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 scroll-smooth"
      >
        <div className="mx-auto max-w-2xl font-sans">
          {/* Article Header */}
          <div className="border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">Deep Dive</span>
              <span className="text-slate-400 text-xs tracking-tight">December 26, 2020 • Marco Behler</span>
            </div>
            <h1 className="mt-3 font-sans text-3xl font-extrabold text-slate-900 tracking-tight leading-tight sm:text-4xl">
              How Spring Boot’s Autoconfigurations Work
            </h1>
            <p className="mt-3 text-sm text-slate-500 italic">
              An in-depth understanding of what Spring Boot's Autoconfigurations are and how they work internally.
            </p>
            <div className="mt-6 rounded-lg bg-indigo-50/30 p-4 border border-indigo-100/50 text-xs italic text-slate-600 leading-relaxed">
              (Editor’s note: At ~3500 words, you probably don’t want to try reading this on a mobile device. Fortunately, we have built this beautiful interactive companion guide!)
            </div>
          </div>

          {/* SECTION 1: INTRODUCTION */}
          <section id="sec-intro" className="py-8 border-b border-slate-100 scroll-mt-6">
            <h2 className="font-sans text-xl font-bold text-slate-800 border-b pb-2 border-slate-100 tracking-tight sm:text-2xl">
              1. Introduction
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                It looks like everyone and their grandma are using Spring Boot to build projects. But very few can answer the question: <span className="font-semibold text-slate-900">"What really is Spring Boot? What are these AutoConfigurations I have heard of?"</span>
              </p>

              <div className="border-l-4 border-indigo-600 bg-indigo-50/40 py-1 pl-4 my-6 rounded-r-lg">
                <span className="block font-sans text-xs font-bold uppercase tracking-wider text-indigo-800">The Short Answer:</span>
                <p className="mt-1 text-slate-800 italic">
                  "Spring Boot takes an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss."
                </p>
              </div>

              <p>
                Wow, that doesn’t help at all, does it?
              </p>

              <p>
                <span className="font-semibold text-slate-900">Luckily, there’s also a long answer:</span> The remainder of this article.
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">A quick caveat</h3>
              <p>
                I can give you a 99,99% guarantee, that you’d rather want to read the "What is Spring Framework?" article first, if…
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
                <li>you are completely new to Spring Boot (or Java).</li>
                <li>you think "Spring Framework, Spring Web MVC and Spring Boot are all the same".</li>
                <li>you think "Cut all this other crap, I just want to learn about Spring Boot!".</li>
              </ul>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">This article’s goals</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-500">
                <li>To give you an in-depth understanding of Spring Boot and its AutoConfigurations.</li>
                <li>To show you how Spring Boot <span className="italic">automagically</span> boots up a Tomcat server whenever you run a main() method.</li>
                <li>To show you how Spring Boot’s properties magic works. You specify a couple of properties and suddenly have working database access.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 2: CONDITIONALS */}
          <section id="sec-conditionals" className="py-8 border-b border-slate-100 scroll-mt-6">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h2 className="font-sans text-xl font-bold text-slate-800 tracking-tight sm:text-2xl">
                2. Conditionals
              </h2>
              <button
                onClick={() => onApplySandboxConfig({
                  classpath: { oracleDriver: true, hikariCP: true, tomcat: false, springWebMvc: false, flyway: true },
                  properties: { datasourceUrl: 'jdbc:oracle:thin:@localhost:1521:XE', datasourceType: 'com.zaxxer.hikari.HikariDataSource', excludeDataSourceAutoConfig: false }
                })}
                className="flex items-center space-x-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Simulate Chapter 2</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Before you become a Spring Boot guru, you need to understand just <span className="text-indigo-600 font-medium italic">one very important concept</span>: Spring Framework’s <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs font-semibold text-indigo-600">@Conditional</code> annotation.
              </p>
              <p className="text-slate-500 italic border-l-2 border-slate-300 pl-4 my-2">
                Don’t skip this section, as it is the basis for everything that Spring Boot does.
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">How to share ApplicationContextConfigurations?</h3>
              <p>
                Imagine you are working for <span className="font-medium text-slate-900">ReallyBigCompany™</span> with a couple of teams working on different Spring projects. But you are <span className="italic">not</span> using Spring Boot, just plain Spring Framework.
              </p>
              <p>
                One developer extracts a common configuration to share beans like a proprietary Flyway database initializer:
              </p>

              {/* Code block 1 */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">ReallyBigCompanySharedContextConfiguration.java</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`@Configuration
public class ReallyBigCompanySharedContextConfiguration {

    @Bean
    public ReallyBigCompanyProprietaryFlywayClone flywayClone() {
        return new ReallyBigCompanyProprietaryFlywayClone();
    }
}`, 'code1')}
                    className="rounded bg-slate-800 border border-slate-700 p-1 text-slate-400 hover:text-white transition-all"
                  >
                    {copiedId === 'code1' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`@Configuration
public class ReallyBigCompanySharedContextConfiguration { // (1)

    @Bean
    public ReallyBigCompanyProprietaryFlywayClone flywayClone() {
        return new ReallyBigCompanyProprietaryFlywayClone(); // (2)
    }
}`}
                </pre>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                (1) SharedContextConfiguration lives in its own jar imported by all teams.<br />
                (2) Since every project uses a relational database, this sets up the flyway clone.
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">What is the problem with shared configurations?</h3>
              <p>
                What if a team creates a microservice which <span className="font-semibold text-slate-900">does not use</span> a relational database? They import the shared JAR, but don't want the database flyway clone because it'll fail on startup without a DB.
              </p>
              <p>
                You need a way to tell Spring: "That config is fine, but please ignore that one specific Bean." This is exactly what <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-indigo-600">@Conditional</code> is for!
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">Making the shared Configuration @Conditional</h3>
              <p>
                We put the condition on our bean definition:
              </p>

              {/* Code block 2 */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">ReallyBigCompanySharedContextConfiguration.java</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`@Configuration
public class ReallyBigCompanySharedContextConfiguration {

    @Bean
    @Conditional(IsRelationalDatabaseCondition.class)
    public ReallyBigCompanyProprietaryFlywayClone flywayClone() {
        return new ReallyBigCompanyProprietaryFlywayClone();
    }
}`, 'code2')}
                    className="rounded bg-slate-800 border border-slate-700 p-1 text-slate-400 hover:text-white transition-all"
                  >
                    {copiedId === 'code2' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`@Configuration
public class ReallyBigCompanySharedContextConfiguration {

    @Bean
    @Conditional(IsRelationalDatabaseCondition.class) // (1)
    public ReallyBigCompanyProprietaryFlywayClone flywayClone() {
        return new ReallyBigCompanyProprietaryFlywayClone();
    }
}`}
                </pre>
              </div>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">Implementing a Spring Condition</h3>
              <p>
                How do we write the <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs font-semibold text-indigo-600">IsRelationalDatabaseCondition</code>? We check if the Oracle driver is on the classpath AND if a property is set:
              </p>

              {/* Code block 3 */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">IsRelationalDatabaseCondition.java</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`public class IsRelationalDatabaseCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return oracleJdbcDriverOnClassPath() && databaseUrlSet(context);
    }
}`, 'code3')}
                    className="rounded bg-slate-800 border border-slate-700 p-1 text-slate-400 hover:text-white transition-all"
                  >
                    {copiedId === 'code3' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`public class IsRelationalDatabaseCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return oracleJdbcDriverOnClassPath() && databaseUrlSet(context); // Matches both!
    }

    private boolean databaseUrlSet(ConditionContext context) {
        return context.getEnvironment().containsProperty("spring.datasource.url");
    }

    private boolean oracleJdbcDriverOnClassPath() {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }
}`}
                </pre>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 mt-6">
                <div className="flex items-center space-x-2 text-slate-950 font-semibold text-xs">
                  <Database className="h-4 w-4 text-indigo-600" />
                  <span>Try this conditional rule live:</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Toggle the Oracle driver Classpath and add a Datasource URL in the Sandbox. Watch how <code className="text-indigo-600 font-mono">ReallyBigCompanyProprietaryFlywayClone</code> gets activated and registered dynamically!
                </p>
                <button
                  onClick={() => onApplySandboxConfig({
                    classpath: { oracleDriver: true, hikariCP: true, tomcat: false, springWebMvc: false, flyway: true },
                    properties: { datasourceUrl: 'jdbc:oracle:thin:@localhost:1521:XE', datasourceType: 'com.zaxxer.hikari.HikariDataSource', excludeDataSourceAutoConfig: false }
                  })}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-all shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Configure Sandbox for this match</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: AUTOCONFIGURATIONS */}
          <section id="sec-autoconfig" className="py-8 border-b border-slate-100 scroll-mt-6">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h2 className="font-sans text-xl font-bold text-slate-800 tracking-tight sm:text-2xl">
                3. AutoConfigurations Demystified
              </h2>
              <button
                onClick={() => onApplySandboxConfig({
                  classpath: { oracleDriver: false, hikariCP: true, tomcat: true, springWebMvc: true, flyway: false },
                  properties: { datasourceUrl: '', datasourceType: 'com.zaxxer.hikari.HikariDataSource', excludeDataSourceAutoConfig: false }
                })}
                className="flex items-center space-x-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Simulate Web Startup</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                What if Spring Boot is <span className="font-semibold text-slate-900">just a shared context configuration</span> with tons of <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-indigo-600">@Conditionals</code>? Let's trace how Spring Boot boots.
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">Three Internal Core Features</h3>
              <p>
                On startup, Spring Boot coordinates three core mechanisms:
              </p>

              <div className="space-y-4 my-6">
                <div className="flex items-start space-x-3 rounded-lg border border-slate-100 p-4 bg-slate-50/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">1</span>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-slate-900">Auto-Registered Property Sources</h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Spring Boot scans 17 predefined property locations (e.g., system variables, application.properties inside jar) to fetch configuration environment variables.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-lg border border-slate-100 p-4 bg-slate-50/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">2</span>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-slate-900">META-INF/spring.factories</h4>
                    <p className="mt-1 text-xs text-slate-500">
                      It opens up `spring.factories` inside the auto-configure JAR and finds a list of 100+ Autoconfigurations mapped to <code className="text-indigo-600 font-mono text-[11px] font-medium bg-indigo-50 px-1 py-0.5 rounded">EnableAutoConfiguration</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-lg border border-slate-100 p-4 bg-slate-50/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-800">3</span>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-slate-900">Enhanced Conditional Annotations</h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Spring Boot packages rich conditionals out-of-the-box:
                    </p>
                    <ul className="mt-2 list-disc pl-4 text-xs text-slate-500 space-y-1">
                      <li><code className="text-indigo-600 font-mono font-medium">@ConditionalOnClass</code>: True if class is on classpath</li>
                      <li><code className="text-indigo-600 font-mono font-medium">@ConditionalOnMissingBean</code>: True if you did NOT write a bean yourself</li>
                      <li><code className="text-indigo-600 font-mono font-medium">@ConditionalOnProperty</code>: True if specific key exists in properties</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: CASE STUDY */}
          <section id="sec-datasource-case" className="py-8 border-b border-slate-100 scroll-mt-6">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h2 className="font-sans text-xl font-bold text-slate-800 tracking-tight sm:text-2xl">
                4. Case Study: DataSource
              </h2>
              <button
                onClick={() => onApplySandboxConfig({
                  classpath: { oracleDriver: false, hikariCP: true, tomcat: false, springWebMvc: false, flyway: false },
                  properties: { datasourceUrl: 'jdbc:mysql://localhost:3306/db', datasourceType: 'com.zaxxer.hikari.HikariDataSource', excludeDataSourceAutoConfig: false },
                  customBeans: { userDataSource: false, userFlywayClone: false }
                })}
                className="flex items-center space-x-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Simulate Hikari Auto</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Let’s analyze <code className="text-slate-900 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">DataSourceAutoConfiguration</code>. This file creates a connection pool automatically once you supply database properties:
              </p>

              {/* Code block 4 */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">DataSourceAutoConfiguration.java</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    // Inner config evaluated when conditions match
}`, 'code4')}
                    className="rounded bg-slate-800 border border-slate-700 p-1 text-slate-400 hover:text-white transition-all"
                  >
                    {copiedId === 'code4' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class }) // (1)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {

    @Configuration(proxyBeanMethods = false)
    @Conditional(PooledDataSourceCondition.class)
    @ConditionalOnMissingBean({ DataSource.class }) // (2)
    @Import({ DataSourceConfiguration.Hikari.class })
    protected static class PooledDataSourceConfiguration {
    }
}`}
                </pre>
              </div>

              <p className="text-xs text-slate-400">
                (1) Classpath check: Make sure DataSource exists.<br />
                (2) Back-off: Only load if you didn't define a custom DataSource!
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">What happens when you write a custom @Bean?</h3>
              <p>
                Suppose you write a manual bean override:
              </p>

              {/* Code block 5 */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">MyCustomDataSourceConfiguration.java</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`@Bean
public DataSource dataSource() {
    return new MyCustomSuperSecureDataSource();
}`, 'code5')}
                    className="rounded bg-slate-800 border border-slate-700 p-1 text-slate-400 hover:text-white transition-all"
                  >
                    {copiedId === 'code5' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`@Bean
public DataSource dataSource() {
    return new MyCustomSuperSecureDataSource(); // (1)
}`}
                </pre>
              </div>

              <p className="text-xs text-slate-400">
                (1) Because this bean exists, the <code className="font-mono text-indigo-600 font-medium">@ConditionalOnMissingBean</code> check in Hikari configuration resolves to <span className="text-red-600 font-semibold">false</span>, so Spring Boot backs off! No duplicate bean conflict.
              </p>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 mt-6">
                <div className="flex items-center space-x-2 text-slate-950 font-semibold text-xs">
                  <Code className="h-4 w-4 text-indigo-600" />
                  <span>Test Custom Bean Override:</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Enable 'User Defined Custom DataSource Bean' in the simulator. Look at the DataSource status: HikariDataSource turns Inactive and explains it backed off to prioritize your custom bean!
                </p>
                <button
                  onClick={() => onApplySandboxConfig({
                    customBeans: { userDataSource: true, userFlywayClone: false }
                  })}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-all shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Toggle Bean in Sandbox</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 5: DEPENDENCIES */}
          <section id="sec-dependencies" className="py-8 border-b border-slate-100 scroll-mt-6">
            <h2 className="font-sans text-xl font-bold text-slate-800 border-b pb-2 border-slate-100 tracking-tight sm:text-2xl">
              5. Dependency Management
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                How do all these dependencies get on the classpath in Spring Boot projects? And how come you do not have to specify any version numbers?
              </p>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">Analyzing spring-boot-starter-web</h3>
              <p>
                When you import a "starter" package, it transitively bundles several dependent modules:
              </p>

              {/* XML Code block */}
              <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 shadow-xl font-mono text-xs leading-relaxed">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] text-slate-400 ml-2">pom.xml</span>
                  </div>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs text-indigo-200 leading-normal bg-slate-900">
{`<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId> <!-- (1) Tomcat triggers @ConditionalOnClass -->
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId> <!-- (2) WebMVC allows @RestController -->
    </dependency>
</dependencies>`}
                </pre>
              </div>

              <h3 className="mt-6 font-sans text-base font-semibold text-slate-900">Why can you drop dependency versions in Spring Boot?</h3>
              <p>
                Your maven project inherits from `spring-boot-dependencies` as parent. Under the hood, this parent POM houses a massive <code className="text-indigo-600 font-mono text-xs font-medium bg-indigo-50 px-1 py-0.5 rounded">&lt;dependencyManagement&gt;</code> index mapping exact versions for a curated ecosystem.
              </p>
            </div>
          </section>

          {/* SECTION 6: FAQ */}
          <section id="sec-faq" className="py-8 scroll-mt-6">
            <h2 className="font-sans text-xl font-bold text-slate-800 border-b pb-2 border-slate-100 tracking-tight sm:text-2xl">
              6. FAQ
            </h2>
            <div className="mt-4 space-y-6 text-sm leading-relaxed text-slate-600">
              <div>
                <h4 className="font-sans font-semibold text-slate-900">How can I exclude specific AutoConfigurations?</h4>
                <p className="mt-1 text-slate-500">
                  Using annotation properties:
                </p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs text-indigo-200 leading-normal">
{`@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})`}
                </pre>
              </div>

              <div>
                <h4 className="font-sans font-semibold text-slate-900">What is the difference between Spring and Spring Boot?</h4>
                <p className="mt-1 text-slate-500">
                  Spring Framework is a collection of utilities to construct modular Java applications (Dependency Injection, transaction management, MVC). Spring Boot is a companion layer that opinionatedly configures standard Spring beans for you dynamically.
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-6 text-center">
                <Award className="mx-auto h-8 w-8 text-indigo-600 animate-bounce" />
                <h3 className="mt-3 font-sans text-sm font-bold text-slate-900">Ready to test your knowledge?</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Take the interactive quiz or play with the Sandbox simulator to build a concrete understanding of conditions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
