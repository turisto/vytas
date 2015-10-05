---
layout: post
title: Java EE application configuration using Aeonbits Owner
category: java
tags: cdi java-ee owner configuration
author: vr
published: true
---
<p> 
Every (almost) Java EE based application needs configuration — local, test or production — it does not matter. What matters — how easily this
configuration solution is maintained and how easily the environment may be changed. 
</p>

<p> 
There are many ways to achieve the requirement, however in this blog I will cover one of possible CDI based configuration solutions — Owner by <a
href="http://owner.aeonbits.org/">http://owner.aeonbits.org/</a>. 
</p>

<p>
Usually there are several stages when properties used in production:
</p>

<ol>
<li >
Hardcoded properties (usually done by novice programmers, otherwise I would treat such properties as constants);</li> <li >Properties file
inside application war file (different properties configured during build time. It is not correct, because the same build cannot be deployed on
different environments);
</li> 
<li>
Properties file stored in server file system (properties are independent from war and is environment
specific).
</li>
</ol>

<p>
Java EE lacks easy configuration functionality. There are many discussions related to this topic
</p>

<ol>
<li>
<a
href="http://www.adam-bien.com/roller/abien/entry/how_to_configure_java_ee"
data-href="http://www.adam-bien.com/roller/abien/entry/how_to_configure_java_ee" rel="nofollow">HOW TO
CONFIGURE JAVA EE 6+ APPLICATIONS&nbsp;…WITHOUT XML</a>
</li>

<li>
<a
href="http://stackoverflow.com/questions/5335979/storing-and-editing-configuration-for-java-ee-applications"
data-href="http://stackoverflow.com/questions/5335979/storing-and-editing-configuration-for-java-ee-applications" rel="nofollow">Storing and editing configuration for Java EE applications at Stack Overflow</a>
</li>
<li>
<a href="http://blog.eisele.net/2011/09/configure-java-ee-applications-or.html"
data-href="http://blog.eisele.net/2011/09/configure-java-ee-applications-or.html" rel="nofollow">Configure
Java EE applications or “Putting Bien into practice”</a> and more others.
</li>
</ol>

<p>
However they need custom actions to take into account:
</p>

<ul>
<li>
You need to manage property injection yourself;
</li>
<li>
You need to use <a href="http://projects.spring.io/spring-framework/" data-href="http://projects.spring.io/spring-framework/" 
rel="nofollow">Spring framework</a>, which has flexible configuration management mechanism. But do you need
<a href="http://projects.spring.io/spring-framework/" data-href="http://projects.spring.io/spring-framework/"
rel="nofollow">Spring</a> only for property loading? I believe — no ☺
</li>
</ul>

<h3>Preconditions</h3>

<p>You need this environment setup in order to successfully complete the provided guide:</p>

<ul>
<li>
<a href="http://maven.apache.org/" data-href="http://maven.apache.org/" rel="nofollow">Apache Maven 3.x</a>
</li>
<li>
<a href="http://www.eclipse.org/downloads/" data-href="http://www.eclipse.org/downloads/" rel="nofollow">Eclipse
Luna</a>
</li>
<li>
Java EE 7 profile
</li>
<li>
<a href="http://owner.aeonbits.org/" data-href="http://owner.aeonbits.org/" rel="nofollow"><strong>Aeonbits Owner</strong></a>
</li>
</ul>

<h3>Implementation</h3>

<p><strong >Defining an interface</strong></p>

<pre>
/**
 * Application configuration properties are defined here.
 * 
 * @author vicento.ramos
 *
 */
@HotReload
@Sources({
“file:/etc/my-app.properties”, “file:~/.my-app.properties”, “classpath:/my-app.properties” })
@Named(“applicationConfig”)
public interface ApplicationConfig extends Accessible {
 @DefaultValue(“50”)
 @Key(“app.timeout”)
 int getInitialTimeout();
}
</pre>

<p><strong>Creating a producer</strong></p>

<pre>
/**
 * Application scope based configuration file producer.
 * 
 * @author vicento.ramos
 *
 */
@ApplicationScoped
public class ApplicationConfigProducer {
 @Produces
 @ApplicationScoped
 public ApplicationConfig produceSportsConfig() {
  return ConfigFactory.create(ApplicationConfig.class);
 }
}
</pre>

<p><strong>Creating a properties file</strong></p>

<p><strong>my-app.properties </strong>file may be stored in one of these
locations:</p>

<ul>
<li>/etc/my-app.properties</li>
<li>.my-app.properties</li>
<li>/my-app.properties</li>
</ul>

<p>
And the content of the file:</p>

<pre>app.timeout=30</pre>

<p><strong>Usage</strong></p>

<pre>
/**
 * Sample injection point of properties.
 * 
 * @author
vicento.ramos
 *
 */
@Named
public class SampleService {
 @Inject
 private ApplicationConfig applicationConfig;
 
 public void method() {
  System.out.println(String.format(“Config value: %d”, 
  applicationConfig.getInitialTimeout()));
 }
}
</pre>

<h3>Features</h3>

<ul>
<li>Multiple configuration locations — you may configure multiple lookup locations where
configuration files may be fetched from;</li>
<li>CDI Injection — Java EE based CDI injection using <em>@Named</em> and <em>@Inject </em>annotation</li><li>Default values — you may configure default values easily using <em>@DefaultValue</em></li><li>Hot reload — you may easily define the interval for properties hot reloading using 
<em>@HotReload</em></li><li>And many more if required</li></ul>

<h3>Resources</h3>

<ul><li><a href="https://github.com/aracrown/ara-blog-examples/tree/master/s01e01"
data-href="https://github.com/aracrown/ara-blog-examples/tree/master/s01e01" rel="nofollow">Source in Git
repository</a></li></ul>

