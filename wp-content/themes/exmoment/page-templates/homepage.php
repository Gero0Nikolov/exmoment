<?php
// Template name: Homepage
get_header();
?>

<div id="homepage-contaiener" class="homepage-container">
	<div id="logo-container" class="logo-container">
		<a href="<?php echo wp_login_url(); ?>" class="login-anchor">Login</a>
		<h1 class="logo">E<span class="small">x</span>Moment</h1>
		<h2 class="sub-title">Simple home automation simpler life.</h2>
	</div>
	<div id="explanation-section" class="section-container simple">
		<h1 class="section-title">What is it?</h1>
		<div class="section-content">
			<strong>1)</strong> ExMoment is a web based application which allows you to connect two independent devices and control them within the application eco system.<br/>
			<br/>
			<strong>2)</strong> This <span class="marked">ecosystem</span> enables you to control your <strong>music</strong>, <strong>home security</strong> or your <strong>alarm clocks</strong>. Creating a simple home automation network with all of your devices.<br/>
			<br/>
			<strong>3)</strong> It works like a TV with a remote control. With that difference here you are saying which device will be the TV and which device will be the remote!
		</div>
	</div>
	<div id="how-it-works-section" class="section-container bright">
		<h1 class="section-title">How it works?</h1>
		<div class="section-content"><strong>Start your laptop, grab your phone, enjoy the fun!</strong></div>
		<a href="https://www.youtube.com/watch?v=kEwi-LEnswk&t=16s" target="_blank" class="section-button">Watch it!</a>
	</div>
	<div id="set-it-section" class="section-container simple">
		<h1 class="section-title">Set it up!</h1>
		<div class="section-content"><strong>Connect your laptop, choose the remote, that's it!</strong></div>
		<a href="#!" target="_blank" class="section-button">Watch it!</a>
	</div>
	<div id="subscribe-section" class="section-container bright">
		<h1 class="section-title">Get your pass now!</h1>
		<div class="flex-row">
			<div class="relative-container">
				<input type="email" id="email" required="required">
				<label for="email">Email</label>
			</div>
			<button id="submit-email">Get</button>
		</div>
	</div>
</div>

<?php get_footer(); ?>
