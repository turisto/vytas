---
layout: post
title: Java EE 8 MVC with Ozark and Apache Tomcat
category: java
tags: java-ee MVC Ozark JAX-RS
author: vr
"header-img": "images/1.jpg"
published: true 
---

<p>
It is always fun to try out new things, features and frameworks. This time I will try to check how far <a href="https://ozark.java.net/" rel="nofollow">Ozark</a> 
framework and Java 8 MVC  went :) 
How easy the MVC development is in reality? What first impressions are when you need something more complex, not only @GET annotation?
</p> 


<p>
If you are not familiar with Java EE 8 MVC (<a href="https://jcp.org/en/jsr/detail?id=371" rel="nofollow">JSR 371</a>) specification or <a href="https://ozark.java.net/" rel="nofollow">Ozark</a> or  looking for a ready to run solution you may jump into Resources section :)
</p>

<h3>Yet another Web UI framework?</h3>

<p>Well, I would say it’s more like a new UI engine, re-using and combining existing technologies. Why?</p>

<p><strong>Model</strong></p>

<p>
<u>For models we can simply reuse  CDI beans</u>. We will have a normal data container together with <strong>@RequestScoped</strong> annotation. 
I am not sure if <strong>@Named</strong> CDI bean should be representing data though. Things may be go far beyond the simple POJO if not 
controlled properly. I must agree it so easy to use and much more type safe than using <strong>Models</strong> class to populate data. 
<strong>Models</strong> class is a new MVC data wrapper class for you if you are trying to avoid using <strong>@Named</strong> CDI beans, but it is also 
less strict in data type control. You may treat it as a simple Map where you can put whatever you want. 
</p>

<p><strong>View</strong></p>

<p><u>Support of existing templating engines</u>. The cool thing is that you can use JSP or Facelets to represent the data. 
The more cool thing is that you can already get autocompletion feature in your IDE without any cost (At least in Eclipse) :) 
Yes, autocompletion works only if CDI beans are used, but anyway. <a href="https://ozark.java.net/" rel="nofollow">Ozark</a> 
claims that it supports many more templating engines, 
such as 
#<a href="http://freemarker.org/" rel="nofollow">Freemarker</a>, 
#<a href="http://jknack.github.io/handlebars.java/" rel="nofollow">Handlebars</a>, 
#<a href="http://jade-lang.com/" rel="nofollow">Jade</a>, 
#<a href="https://github.com/spullara/mustache.java" rel="nofollow">Mustache</a>, 
#<a href="http://www.thymeleaf.org/" rel="nofollow">Thymeleaf</a> or 
#<a href="http://velocity.apache.org/" rel="nofollow">Velocity</a>. 
I did not try them, but early performance results 
may be found in GIT repository (<a href="https://github.com/lefloh/ozark-viewengine-loadtests" rel="nofollow">https://github.com/lefloh/ozark-viewengine-loadtests</a>)

</p>

<p><strong>Controller</strong></p>

<p><u>MVC 1.0 uses JAX-RS annotations for controllers</u>. You define JAX-RS methods within your resource class. In addition to default JAX-RS annotations 
there is a need to add <strong>@Controller</strong> annotation as well. The only difference is in method return type. You have to:
</p>
<ul>
<li>return String with view name or </li>
<li>expose view template name is via annotation @View and have a method return type as void or </li>
<li>build and return a normal Response object with custom properties.</li>
</ul>
<p>
So at the end of the day there is a new framework, aggregating CDI, JAX-RS and JSP/Facelets into one, hopefully, nice built JAX-RS based web framework. 
Maybe you will like it if you were looking for something like this:) Unless you are already using <a href="" rel="nofollow">Spring MVC</a>.
</p>

<h3>File upload</h3>

<p>
So, going into details - file upload form. If you are using JAX-RS to upload file then there is nothing new. 
Otherwise there are some steps to execute in order safely use file upload form.
</p>

<p><strong>Maven dependency</strong></p>

<p>Add Jersey support to handle multipart forms.</p>
<pre>
&lt;dependency&gt;
	&lt;groupId&gt;org.glassfish.jersey.media&lt;/groupId&gt;
	&lt;artifactId&gt;jersey-media-multipart&lt;/artifactId&gt;
	&lt;version&gt;${2.x latest version}&lt;/version&gt;
&lt;/dependency&gt;
</pre>
	
<p><strong>Configure the application</strong></p>

<p>Add multipart feature to the application resources list.</p>

<pre>
@ApplicationPath("/blog")
public class BlogApplication extends javax.ws.rs.core.Application {
	@Override
	public Set<Class<?>> getClasses() {
		final Set<Class<?>> resources = new HashSet<Class<?>>();

		//...

		// Add additional features such as support for Multipart.
		<strong>resources.add(MultiPartFeature.class);</strong>

		return resources;
	}
}
</pre>
<p><strong>Implement controller method</strong></p>

<pre>
@POST
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Path("/upload/")
public String upload(@BeanParam FileUploadEntryRequest form) {
	Preconditions.checkArgument(form != null, "Request is missing");
	byte[] datainput = null;
	try {
		datainput = org.apache.commons.io.IOUtils.toByteArray(form.getUploadedInputStream());
	} catch (IOException e) {
		LOGGER.error("Could not retrieve image from file upload form.", e);
	}
	...

	return "redirect:/posts/";
}
</pre>

<p>When developing <strong>@BeanParam</strong> class (Full source code you can find in Github repository) you have to remember to use <strong>org.glassfish.jersey.media.multipart.FormDataParam</strong> annotations for ALL params, not only for file related properties.
Default <strong>@FormParam</strong> will not be understood by Ozark (or Jersey, or both?). I would expect default JAX-RS annotation to be working as well. 
But what a surprise :)
</p>

<h3>Image display</h3>

<p>
Image retrieval is even easier. Just create a separate resource to get <strong>StreamingOutput</strong> by id and you should be fine!
</p>

<pre>
@Path("/resources/")
public class ImageResource {

	@Inject
	private BlogEntryDao blogEntryDao;

	@GET
	@Path("/image/{img}.img")
	@Produces({ "image/*" })
	public StreamingOutput getImage(@PathParam("img") String imagePath) {
		Preconditions.checkArgument(!Strings.isNullOrEmpty(imagePath), 
			"Blog post path is empty. Image cannot be retrieved.");
		byte[] img = blogEntryDao.getImage(imagePath);

		return new StreamingOutput() {
			@Override
			public void write(OutputStream output) throws IOException, WebApplicationException {
				output.write(img);
				output.flush();
			}

		};
	}
}
</pre>

<p>And usage in the html:</p>

<pre>
&lt;img src="/s01e07/blog/resources/image/${blogEntryBean.blogEntry.path}.img" class="img-responsive" /&gt;
</pre>

<h3>Things did not tried yet</h3>

<p>
So far I did not try exception handling, event notification, form field validation and error display on form submit and many more things :)
</p>

<h3>Conclusion</h3>

<p>
First impression is really good. You have to find some things yourself if you were not using REST to develop web applications. But then you may get control over what you 
do and how you do. Such framework is also useful for scaling stateless web applications in more standard way without forcing to use Spring MVC or other 
hybrid solution.

</p>
<p>You may argue that writing Primefaces based application is faster because there are already components ready for use.</p>

<p>Some things were not working in Ozark: 
</p>
<ul>
<li><strong>${mvc.contextPath}</strong>. I was not able to get context path in JSP template when deploying web application other than ROOT. </li>

<li>Mounting REST path of the application to ROOT (<strong>@ApplicationPath("/")</strong>) did not work.</li>
<li>Deploying the application to Wildfly application server - no luck. Ozark seems to be tightly coupled with Jersey :) And I had no time to replace RESTEasy with Jersey in Wildfly.</li>
</ul>

<p>Hopefully you enjoyed the reading. Have a nice day and see you next time!</p>

<h3>Resources</h3>

<ul>
<li><a href="https://github.com/aracrown/ara-blog-examples/tree/master/s01e07" rel="nofollow">Source in Git repository</a></li>
<li><a href="https://jcp.org/en/jsr/detail?id=371" rel="nofollow">https://jcp.org/en/jsr/detail?id=371</a></li>
<li><a href="https://ozark.java.net/" rel="nofollow">https://ozark.java.net/</a></li>
<li><a href="https://mvc.zeef.com/manfred.riem" rel="nofollow">https://mvc.zeef.com/manfred.riem</a></li>
<li><a href="https://blogs.oracle.com/theaquarium/entry/jsr371_edr" rel="nofollow">https://blogs.oracle.com/theaquarium/entry/jsr371_edr</a></li>
<li><a href="http://www.mscharhag.com/java-ee-mvc/ozark-getting-started" rel="nofollow">http://www.mscharhag.com/java-ee-mvc/ozark-getting-started</a></li>
<li><a href="http://blog.kaltepoth.de/posts/2015/04/21/view-technologies-for-mvc-1-0.html" rel="nofollow">http://blog.kaltepoth.de/posts/2015/04/21/view-technologies-for-mvc-1-0.html</a></li>
<li><a href="http://arjan-tijms.omnifaces.org/2014/11/jsf-and-mvc-10-comparison-in-code.html" rel="nofollow">http://arjan-tijms.omnifaces.org/2014/11/jsf-and-mvc-10-comparison-in-code.html</a></li>
<li><a href="http://kodcu.com/2015/02/first-look-at-jsr-371-mvc-1-0-spesification-and-ozark-ri/" rel="nofollow">http://kodcu.com/2015/02/first-look-at-jsr-371-mvc-1-0-spesification-and-ozark-ri/</a></li>
</ul>

<p>
<span class="caption text-muted">Photographs by <a href="https://www.flickr.com/photos/beantin/">James Royal-Lawson</a>.</span>
</p>