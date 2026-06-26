import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does the @Conditional annotation in Spring Framework actually do?",
    options: [
      "It speeds up JVM compilation times under heavy load",
      "It determines whether a bean, component, or configuration is registered in the context based on custom boolean matches",
      "It restricts network requests to secure SSL/TLS ports",
      "It automatically converts legacy XML config files into Spring Boot Java configuration classes"
    ],
    correctIndex: 1,
    explanation: "@Conditional allows Spring to dynamically decide whether to load and register a bean or configuration during ApplicationContext startup based on custom conditions (like checking the classpath or environment properties)."
  },
  {
    id: 2,
    question: "How does Spring Boot's AutoConfiguration 'back off' when you define your own custom Bean?",
    options: [
      "It causes a bean definition collision and crashes your application immediately",
      "It deletes your custom bean class at runtime and replaces it with its own default implementation",
      "It detects your bean and backs off automatically using the @ConditionalOnMissingBean annotation",
      "It forces you to manually delete the spring-boot-starter dependencies from your pom.xml"
    ],
    correctIndex: 2,
    explanation: "Through @ConditionalOnMissingBean, Spring Boot checks if a bean of that type is already registered. If it is (because you defined it), Spring Boot's default autoconfiguration configuration is bypassed, allowing you to easily override defaults."
  },
  {
    id: 3,
    question: "Where is the central registry file that Spring Boot scans on startup to load its list of AutoConfigurations?",
    options: [
      "In application.properties under the 'spring.boot.autoconfigure' key",
      "Inside the META-INF/spring.factories file under the EnableAutoConfiguration key",
      "In the OS environment variables as SPRING_BOOT_AUTOCONFIG",
      "Directly from the spring-boot-starter-web pom.xml file"
    ],
    correctIndex: 3,
    explanation: "Spring Boot reads META-INF/spring.factories inside its auto-configure jar files. It looks up the fully-qualified class names mapped to 'org.springframework.boot.autoconfigure.EnableAutoConfiguration' and attempts to evaluate each one."
  },
  {
    id: 4,
    question: "Why can you omit version numbers (e.g. <version>) for standard libraries in a Spring Boot Maven pom.xml?",
    options: [
      "Spring Boot automatically queries Google to find the latest version number at build time",
      "The Maven compiler is smart enough to guess stable versions by trial and error",
      "The parent POM 'spring-boot-dependencies' defines standard compatible version numbers inside its <dependencyManagement> section",
      "Modern Maven repositories no longer require version numbers for any Java libraries"
    ],
    correctIndex: 2,
    explanation: "The spring-boot-dependencies project acts as a BOM (Bill of Materials) or is inherited as a parent POM. It manages versions for hundreds of popular third-party libraries so that you get guaranteed-compatible versions without manual specification."
  },
  {
    id: 5,
    question: "How can you disable or exclude a specific AutoConfiguration, like DataSourceAutoConfiguration?",
    options: [
      "Remove Tomcat starter dependencies from your class path completely",
      "Using @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) or the spring.autoconfigure.exclude property",
      "Rename the .jar files inside your local maven repository to bypass loading",
      "Specify custom @Conditional annotations on your JDK's Object class"
    ],
    correctIndex: 1,
    explanation: "You can exclude AutoConfigurations using the 'exclude' attribute of the @SpringBootApplication annotation, or by configuring the 'spring.autoconfigure.exclude' property in your application.properties file."
  }
];

export interface ArticleSection {
  id: string;
  title: string;
  content: string; // HTML-friendly markdown
}

export const articleSections = [
  {
    id: "intro",
    title: "1. Introduction",
    short: "What really is Spring Boot, and what are Autoconfigurations?"
  },
  {
    id: "conditionals",
    title: "2. The Magic: @Conditional",
    short: "The underlying annotation that makes all of Spring Boot possible."
  },
  {
    id: "autoconfig",
    title: "3. AutoConfigurations Demystified",
    short: "How property files, spring.factories, and conditionals work together on boot."
  },
  {
    id: "datasource-case",
    title: "4. Case Study: DataSource",
    short: "Deconstructing DataSourceAutoConfiguration & Hikari config."
  },
  {
    id: "dependencies",
    title: "5. Dependency Management",
    short: "Why you can drop dependency versions in Maven and Gradle."
  },
  {
    id: "faq",
    title: "6. Frequently Asked Questions",
    short: "Excluding autoconfigurations, documentation, and Spring vs. Spring Boot."
  }
];
