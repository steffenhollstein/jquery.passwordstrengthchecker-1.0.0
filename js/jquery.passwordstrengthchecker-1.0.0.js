/*!
* jQuery Plugin "Password Strength Checker" v1.0.0 <http://code.google.com/p/jquery-passwordstrengthchecker/> 
* @requires jQuery v1.3.2 or later 
* is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
(function($){
	
	
	/*
		Examples:
		--------------------------------------------------------
		<script type="text/javascript">
			jQuery(function(){
				
				// default, right
				jQuery(
					".mycustomclass-default"
				).passwordstrengthchecker();
				
				// left
				jQuery(
					".mycustomclass-left"
				).passwordstrengthchecker({
					position : 'left'
				});
				
				// top
				jQuery(
					".mycustomclass-top"
				).passwordstrengthchecker({
					position : 'top'
				});
				
				// bottom
				jQuery(
					".mycustomclass-bottom"
				).passwordstrengthchecker({
					position : 'bottom'
				});
				
			});
		</script>
		<form action="" autocomplete="off">
			
			<div>
				<h3>
					Default, right
				</h3>
				<input 
					type="password" 
					name="password_right" 
					class="mycustomclass-default"
				/><br/><br/>
			</div>
			
			<div>
				<h3>
					Left
				</h3>
				<input 
					type="password" 
					name="password_left" 
					class="mycustomclass-left"
				/><br/><br/>
			</div>
			
			<div>
				<h3>
					Top
				</h3>
				<input 
					type="password" 
					name="password_top" 
					class="mycustomclass-top"
				/><br/><br/>
			</div>
			
			<div>
				<h3>
					Bottom
				</h3>
				<input 
					type="password" 
					name="password_bottom" 
					class="mycustomclass-bottom"
				/><br/><br/>
			</div>
			
		</form>
		
		
		Example, localized "German":
		--------------------------------------------------------
		<script type="text/javascript">
			var germanStrings = {
				headline : 'Passwortsicherheit:',
				quality : {
					too_short : 'zu kurz',
					weak : 'Schwach',
					good : 'Gut',
					strong : 'Stark'
				},
				help : 'Verwenden Sie mindestens 8 Zeichen! Das Passwort sollte aus Buchstaben, Zahlen und Sonderzeichen bestehen. Ihr Passwort sollte keine Reihen wie z.B. &quot;1234&quot; oder &quot;abcd&quot; enthalten.' 
			};
			
			jQuery(function(){
				
				jQuery(
					".mycustomclass-localized"
				).passwordstrengthchecker({
					localizedStrings : germanStrings
				});
				
			});
		</script>
		<form action="" autocomplete="off">
			
			<div>
				<input 
					type="password" 
					name="password_localized" 
					class="mycustomclass-localized"
				/>
			</div>
			
		</form>
	*/
	
	
	// Default options
	var defaults = {
		
		selectors : {
			selectorWrapContainer : '.password-strength',
			selectorInput : '.password-strength-input',
			selectorTarget : '.password-strength-target',
			selectorTargetInner : '.password-strength-target-inner',
			selectorTargetArrow : '.password-strength-target-arrow',
			selectorResult : '.password-strength-result',
			selectorResultHeadline : '.password-strength-result-headline',
			selectorResultText : '.password-strength-result-text',
			selectorStatusBar : '.password-strength-statusbar',
			selectorStatusBarInner : '.password-strength-statusbar-inner',
			selectorHelp : '.password-strength-help',
			
			selectorOrientationLeft : '.password-strength-orientation-left',
			selectorOrientationTop : '.password-strength-orientation-top',
			selectorOrientationRight : '.password-strength-orientation-right',
			selectorOrientationBottom : '.password-strength-orientation-bottom',
			
			selectorStatusHide : '.password-strength-status-hide',
			selectorStatusShow : '.password-strength-status-show',
			selectorStatusQualityTooShort : '.password-strength-short',
			selectorStatusQualityWeak : '.password-strength-weak',
			selectorStatusQualityGood : '.password-strength-good',
			selectorStatusQualityStrong : '.password-strength-strong'
		},
		
		localizedStrings : {
			headline : 'Safety factor:', //Passwortsicherheit
			quality : {
				too_short : 'too short', 
				weak : 'weak', 
				good : 'good', 
				strong : 'strong' 
			},
			
			help : 'Apply not less than 8 characters long and only formed of lower case characters, you need to make it better, perhaps by adding a number or more characters.' 
		},
		
		checkRuleLengthMin : 2,
		checkRuleLengthPrefered : 8,
		
		checkRules : {
			rule_1 : [
				// add qualitiy point if all of these rules passed
				/([a-zA-Z])/,
				/([0-9])/
			],
			rule_2 : [
				/([!,%,&,@,#,$,^,*,?,_,~])/
			],
			rule_3 : [
				/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/
			]
		},
		
		position : 'right', // options: left, top, right, bottom
		
		// debug options
		debug : false,
		debugPrefix : '[PasswordStrengthChecker] '
		
	};
	
	
	var methods = {
		
		
		/********** init - BEGIN **********/
		init : function( globaloptions ) {
			
			
			var mainObj = jQuery(
				this
			);
			
			
			// merge the plugin defaults with custom options
			var globaloptions = jQuery.extend(
				{}, 
				defaults, 
				globaloptions
			);
			
			
			methods.debugOutput(
				'------ begin of debugging ------'
			);
			
			
			if( mainObj.length > 0 )
			{
				mainObj.each(function(){
					
					var thisObj = jQuery(
						this
					);
					
					if( !thisObj.hasClass("prepared") )
					{
						methods.debugOutput(
							'prepare following object'
						);
						
						methods.debugOutput(
							thisObj
						);
						
						methods.debugOutput(
							'orientation mode: ' + globaloptions.position
						);
						
						var additionalClassName = (function(){
							
							if( globaloptions.position == 'left' )
							{
								return globaloptions.selectors.selectorOrientationLeft.replace(".", "");
							} 
							else if( globaloptions.position == 'top' ) 
							{
								return globaloptions.selectors.selectorOrientationTop.replace(".", "");
							} 
							else if( globaloptions.position == 'right' ) 
							{
								return globaloptions.selectors.selectorOrientationRight.replace(".", "");
							} 
							else  
							{
								return globaloptions.selectors.selectorOrientationBottom.replace(".", "");
							}
							
						})();
						
						
						thisObj.wrap(
							'<div class="' + 
								globaloptions.selectors.selectorWrapContainer.replace(".", "") + ' ' + 
								globaloptions.selectors.selectorStatusHide.replace(".", "") + ' ' + 
								additionalClassName + 
							'"></div>'
						);
						
						
						var wrapObj = thisObj.parent(
							globaloptions.selectors.selectorWrapContainer
						);
						
						
						wrapObj.append(
							'<div class="' + globaloptions.selectors.selectorTarget.replace(".", "") + '">' + 
								'<div class="' + globaloptions.selectors.selectorTargetInner.replace(".", "") + '">' + 
									'<div class="' + globaloptions.selectors.selectorResult.replace(".", "") + '">' + 
										'<div class="' + globaloptions.selectors.selectorResultHeadline.replace(".", "") + '">' + 
											globaloptions.localizedStrings.headline + 
										'</div>' + 
										'<div class="' + globaloptions.selectors.selectorResultText.replace(".", "") + '"></div>' + 
									'</div>' + 
									'<div class="' + globaloptions.selectors.selectorStatusBar.replace(".", "") + '">' + 
										'<div class="' + globaloptions.selectors.selectorStatusBarInner.replace(".", "") + '"></div>' + 
									'</div>' + 
									'<div class="' + globaloptions.selectors.selectorHelp.replace(".", "") + '"></div>' + 
									'<div class="' + globaloptions.selectors.selectorTargetArrow.replace(".", "") + '"></div>' + 
								'</div>' + 
							'</div>'
						).addClass(
							"prepared"
						).find(
							globaloptions.selectors.selectorTarget + ' ' + globaloptions.selectors.selectorHelp
						).html(
							globaloptions.localizedStrings.help
						);
						
						
						var targetObj = wrapObj.find(
							globaloptions.selectors.selectorTarget
						);
						
						
						var getDimensionsOfWrapObj = (function(){
							
							var currentWidth = wrapObj.outerWidth();
							
							currentWidth = (
								!isNaN( currentWidth ) ? currentWidth : 0
							);
							
							
							var currentHeight = wrapObj.outerHeight();
							
							currentHeight = (
								!isNaN( currentHeight ) ? currentHeight : 0
							);
							
							
							return [
								currentWidth,
								currentHeight
							];
							
							
						})();
						
						
						methods.debugOutput(
							'dimensions of ' + globaloptions.selectors.selectorWrapContainer + ': ' + getDimensionsOfWrapObj[0] + ' (width), ' + getDimensionsOfWrapObj[1] + ' (height)'
						);
						
						
						var getDimensionsOfTargetObj = (function(){
							
							var currentWidth = targetObj.outerWidth();
							
							currentWidth = (
								!isNaN( currentWidth ) ? currentWidth : 0
							);
							
							
							var currentHeight = targetObj.outerHeight();
							
							currentHeight = (
								!isNaN( currentHeight ) ? currentHeight : 0
							);
							
							
							return [
								currentWidth,
								currentHeight
							];
							
						})();
						
						
						methods.debugOutput(
							'dimensions of ' + globaloptions.selectors.selectorTarget + ': ' + getDimensionsOfTargetObj[0] + ' (width), ' + getDimensionsOfTargetObj[1] + ' (height)'
						);
						
						
						var positioning = (function(){
							
							if( globaloptions.position == 'left' )
							{
								// left
								return {
									left : '-' + getDimensionsOfTargetObj[0] + 'px'
								};
							} 
							else if( globaloptions.position == 'top' ) 
							{
								// top
								return {
									left : '-' + ( (getDimensionsOfTargetObj[0] - getDimensionsOfWrapObj[0] ) / 2) + 'px',
									top : '-' + getDimensionsOfTargetObj[1] + 'px'
								};
							} 
							else if( globaloptions.position == 'right' ) 
							{
								// right
								return {
									right : '-' + getDimensionsOfTargetObj[0] + 'px'
								};
							} 
							else  
							{
								// bottom
								return {
									left : '-' + ( (getDimensionsOfTargetObj[0] - getDimensionsOfWrapObj[0] ) / 2) + 'px',
									top : getDimensionsOfWrapObj[1] + 'px'
								};
							}
							
						})();
						
						
						targetObj.css(
							positioning
						);
						
					} 
					else 
					{
						
						methods.debugOutput(
							'following object already prepared'
						);
						
						methods.debugOutput(
							thisObj
						);
						
					}
					
				}).bind("focusin keyup focusout", function(event){
					
					var thisObj = jQuery(
						this
					);
					
					var wrapObj = thisObj.parent(
						globaloptions.selectors.selectorWrapContainer
					);
					
					var listClassRemover = (
						globaloptions.selectors.selectorStatusHide.replace(".", "") + ' ' + 
						globaloptions.selectors.selectorStatusShow.replace(".", "") + ' ' + 
						globaloptions.selectors.selectorStatusQualityTooShort.replace(".", "") + ' ' + 
						globaloptions.selectors.selectorStatusQualityWeak.replace(".", "") + ' ' + 
						globaloptions.selectors.selectorStatusQualityGood.replace(".", "") + ' ' + 
						globaloptions.selectors.selectorStatusQualityStrong.replace(".", "")
					);
					
					
					if( event.type == 'focusout' )
					{
						wrapObj.removeClass(
							listClassRemover
						).addClass(
							globaloptions.selectors.selectorStatusHide.replace(".", "")
						);
					} 
					else 
					{
						var getStatus = (function(){
							
							var status = methods.checkInputVal(
								thisObj.val(),
								globaloptions
							);
							
							var returnValue = {
								statusClass : '',
								resultText : ''
							};
						
							if( status == 0 )
							{
								returnValue.statusClass = globaloptions.selectors.selectorStatusQualityTooShort.replace(".", "");
								returnValue.resultText = globaloptions.localizedStrings.quality.too_short;
							} 
							else if( status == 1 ) 
							{
								returnValue.statusClass = globaloptions.selectors.selectorStatusQualityWeak.replace(".", "");
								returnValue.resultText = globaloptions.localizedStrings.quality.weak;
							} 
							else if( status == 2 ) 
							{
								returnValue.statusClass = globaloptions.selectors.selectorStatusQualityGood.replace(".", "");
								returnValue.resultText = globaloptions.localizedStrings.quality.good;
							} 
							else if( status == 3 ) 
							{
								returnValue.statusClass = globaloptions.selectors.selectorStatusQualityStrong.replace(".", "");
								returnValue.resultText = globaloptions.localizedStrings.quality.strong;
							}
							
							return returnValue;
							
						})();
						
						
						// set status class, add result text
						wrapObj.removeClass(
							listClassRemover
						).addClass(
							getStatus.statusClass + ' ' + globaloptions.selectors.selectorStatusShow.replace(".", "")
						).find(
							globaloptions.selectors.selectorTarget + ' ' + globaloptions.selectors.selectorResult + ' ' + globaloptions.selectors.selectorResultText
						).text(
							getStatus.resultText
						);
					}
				});
			} 
			else 
			{
				methods.debugOutput(
					'No Object found'
				);
			}
			
			
		},
		/********** init - END **********/
		
		
		
		
		/********** checkInputVal - BEGIN **********/
		checkInputVal : function(val,settings) {
			
			
			// calculate quality 
			var quality = 0;

			if( val.length >= settings.checkRuleLengthPrefered )
			{
				quality += 1;
			}
			
			jQuery.each(settings.checkRules, function(i, currentRuleArray){
				
				quality += (function(){
					
					var returnValue = 0;
					
					for( i=0; i < currentRuleArray.length; i++ )
					{
						if( val.match( currentRuleArray[i] ) )
						{
							returnValue = 1;
						} 
						else 
						{
							returnValue = 0;
						}
					}
					
					return returnValue;
					
				})();
				
			});
			
			
			// set levels of quality
			if( val.length < settings.checkRuleLengthMin )
			{
				return 0; //passwort zu kurz
			}
			
			if( quality < 2 )
			{
				return 1; //schwach
			} 
			else if( quality == 2 ) 
			{
				return 2; //gut
			} 
			else 
			{
				return 3; //stark
			}
			
			
		},
		/********** checkInputVal - END **********/
		
		
		
		
		/*
			methods.debugOutput(
				'Your Message'
			);
		*/
		/************ debugOutput - BEGIN ************/
		debugOutput : function(msg){
			
			if( defaults["debug"] )
			{
				msg = typeof(msg) != "undefined" ? msg : '';
				
				if( msg != '' && ("console" in window) )
				{
					if( typeof(msg) == "object" )
					{
						console.log( 
							msg
						);
					} 
					else 
					{
						console.log( 
							defaults["debugPrefix"] + msg
						);
					}
				}
			}
		}
		/************ debugOutput - END ************/
		
		
		
	};
	
	
	jQuery.fn.passwordstrengthchecker = function(method){
		
		// Method calling logic
		if( methods[method] )
		{
			return methods[method].apply(
				this, 
				Array.prototype.slice.call( 
					arguments, 1 
				)
			);
		} 
		else if( typeof method === 'object' || ! method )
		{
			return methods.init.apply(
				this, arguments
			);
		} 
		else 
		{
			jQuery.error( 
				'Method ' +	method + ' does not exist on jQuery.passwordstrengthchecker' 
			);
		}
	};
	
	
})(jQuery);