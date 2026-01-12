#!/usr/bin/env node

const chalk = require('chalk');
const open = require('open');
const inquirer = require('inquirer');
const readline = require('readline');
const player = require('play-sound')(opts = {}); 
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// -----------------------------------------------------------------
// 1. CONFIGURATION & ART
// -----------------------------------------------------------------
// Set padding to 0 for art so the wide globe fits
const PADDING_SIZE = 2; 
const PADDING = ' '.repeat(PADDING_SIZE);
const HIGHSCORE_FILE = path.join(__dirname, 'highscore.json');

function pad(str, padding = PADDING_SIZE) {
  const padStr = ' '.repeat(padding);
  return str.split('\n').map(line => padStr + line).join('\n');
}

function typeText(text, delay = 5) { // Very fast typing for the massive art
  return new Promise((resolve) => {
    const chars = text.split('');
    let i = 0;
    function nextChar() {
      if (i < chars.length) {
        process.stdout.write(chars[i]);
        i++;
        // If it's a space or common char, print faster to speed up the big art
        const currentDelay = chars[i] === ' ' ? 0 : delay;
        setTimeout(nextChar, currentDelay);
      } else {
        console.log();
        resolve();
      }
    }
    nextChar();
  });
}

function getHighScore() {
  try {
    if (fs.existsSync(HIGHSCORE_FILE)) {
      const data = fs.readFileSync(HIGHSCORE_FILE);
      return JSON.parse(data).bestTime;
    }
  } catch (e) {}
  return Infinity;
}

function saveHighScore(time) {
  try {
    fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify({ bestTime: time }));
  } catch (e) {}
}

// --- THE ARTWORK ---

// 1. The Globe (High Def)
const globeArt = `
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+xxxxxxxxxxxxxxxxx+x+xxxxxxxxxxxxxxx++++xxxxx+++xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+++xxxxxxx+++++++++++++++xxxxxx+++++xxxx+++xxxxxxxxx++xxx+++xxx++++++x+++++++++ 
 xxxxxxx+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+x++x+xxxxxxxxxxxxxx+xx+xxxxxxxxxxxxxxx+;;+xxxxxxxxx+xxxxxx++xxxxxxxxxxx+xxxxxxxx+++xxxxxxxxxxxxxxx+++++xxxxxx+++xxx+++++xxxxxx+x+++x+++++++x++++x+++++++ 
 +xxxxxxxxxxxxxx+++xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx++:      .x+xxxxxxx+&X        ;xxxxxxxxxxx+++++++++xxxxxxxxxxxxxxxxxxxx++x+++xxxxxxx+++++xxx++++++;+++++++++xxxx++++++++x++++x+++++++ 
 +X++++++xxxxxxx+X+xx+xx+++xx+xx+++xxxxxxxxxxxxxxxxxx;.     :xxX&&&&&&;X+xxxxxxx;; &&&&&&&&   ;xxx+xxxxxxxxxxxxxxxx+xx+xxxxxxxxxxxxxxxxxxxx+++xxxxxxxxxxxxxxxxxXxxxxx++++;;+;+++++xxxxx++x++++xxxx 
 xxxxxxxxxxxxxxxxxxxXXXXXXXX+XXXXX+Xxxxxxxxxxxxx;    :&&&&&& ;+.  &&$& ;+xxxxxxxx; &$&&   :&&&  ;xx+.   ;xxx+xxx+xxxxxxxxxxxxxxxxxxxxx+xxxxxxxx++x+++x+xxxxxxxxxxxxxxxxxXXXXxXxXx+++xxx+++xxxxxx+x 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx++$&&&&      &&+xxx x&$& +xxxxxxxxX.;&$&  x+  &&&+.xx;$&&$    :xxxxxxxxxx++xxxxxxxxxxxxxxx++++++xxxxxx+xxx++++xxxxxxxxxxxxxxxxxxxxxxXx+xxxxxx+++x+++ 
 xxxxxxxxxxxxxxxXxXxXXxxxxxxxxxXXxxxxxx;  +xxx+$;x&&&X x:+&  ;xxx:.&$& ;xxxxxxxxx X&&& +xXx &&&& +++  &&&&&&;x;. :xxxxx+xxxxxxxx++++xxxxxxxxxxxxx+xxxX+xxxxxx++++x+++xxxxxxxxxxxxxxx++xxxxxxx+x+++ 
 xxxxxxxxxxxxxxxxxxxxxxxxxXxxxxxxxxxx;  && +xxx+; &&&&   &&.:xxxx;.&$&;.xxxx;..;+ &&&& xxx+ &$$& XX; &&&&   :+;&&   ;xxx+xxxxxxxx+x+xxxxxxxx+xxxxxxx+X+xxx++xxxxxxxxxxxxxxxxxxxxxx++x+++++++++;+++ 
 xxxxxx;xxxxxxxxxxxxxxxxxxxxxxxxxxxxx;&&&& :+xxxx: &&&&&&x&&.;..;+ &$&& xxx; && .+&$&x.xx+. &$&& x+ &&&&.:XXXx; X&&& xxxxxxxXxxxxxxxxxxxxx+xxxxxxxx&x&xxxxxxxx++xxx++++xxxxx+xxxxxxxx+xxxxxxxXXXxX 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+:..;;   $& ;x+xxx &&$&    x+.&& : &$$&     &&&  &&$& .x;  &&&&..+..&$&+ +xxx;..&&&& +xxxxxxx+xxxxxxxxxxxxxxxxxxxxx& ++xxxx+xxxxx+++x++x++++++++++xxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX:.&X   ;; && +xxxx; &&&& ;;   &&.&&&&&&&&&&&X:;&&&&&&&X+X&&&&+ :x; &&&& +XxX; && &$&.:xx+  :x++++++++++++++xxxxxxxx& &;++x++++++++++;++xxxxXxXxXxxxxxxxx++x++++++x 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;&&&&&&    && xx+xx :&$&& +&&&&;::         .:;;:      +&X;   .;:  &&&& :x++. &&  &$&$ x+.&&  :xxxXXxxxxxxxxxxxxxxX$& &;x+XX++XX+XXXXXXXxxxxxx++xxxxxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxx+. ;+x: &&&&&&&&  & .xxxx: &&&&&X.   :;;;;:::::....::;;:+;;;;:.:;+xxx&&&&&&+  .. :&X ; &$&& x: &&&&&+xxxxxxxxxxxxxxxxxxX&; &.XXxxXXxxxxxxxxxxxx+XX+XX+x+xxxx++xxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxx+  :&  :x: &  &&&&&&&& ;xx+&$    .+xX$$X$&&&&&&&&&&&&&&&+x++x+:x$&&&$+:.    ;&&&&x&& .+x &$$& : &&    x++xxxxxxxxxxxxxxxx$&  &+:xxxxxxxxxxxxxxxxXxxxxxxxX+xxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxx;.&&&&&&    X&    &&&&&&;xx++;+$&&&&&&&&&&X$&& .&&     X&&&&&&&&&&   &&&&&$$+:   .$&& ;xx &&$& x&;.+xxxxxXXxXXxxxxxxxxxxxx&:: &:xxxxxxxxxxxxxxxxxxxxxxxxxxxX+X+x+xx+xxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxx+&X;&&&&&&&  ;& ;;   x&:;xxX&&&&x          +&&&: &&+     &X&$XX$$&&&.    &&&&&&&$+. ;&+xx.$&$&&& .++:      :+xxxxXxxXxxxxX& x &;+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXxxxxxx+xxxx 
 xxxxxxxxxxxxxxxxxxxxxx;::.  .&&&&&&$&X xxx;..:x&&&&   .:.&&&&&&&&&:       &&&.   $$XXX&&&&&&+:    .  :&&&$+;+xx::&&&& :;  x&&&&&&$  ;xxxxxxxxxx&;:+ &&:+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+xxxxxxx+x 
 xxxxxxxxxxxxxxxxxxxxxxxxxxx+:   &&&&&& :xxxx$&&&     :.+;;;:         :x&&&  ;:: +&&X&&&$    ..  ......  :&&&$xx+;&&. +: &&&&&&&&&&&& :xxxxxxxx$& X+ && +xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+xxxxxxxx 
 xxxxxxXxXxxXxXXxxxXXXXXXXXXXXxx;   &&&&+XX&&&+    .:::: ::   .:+;:&&&&     :::::  &&&    ;+;;+&&X:;;:...:  x&&$x: .:x: &&&&&x      :&;;xxxXxxx& .X+ &&;:+xxxxxxxxxXxxxxxxxxxxxxxxxxxxxxxXxxxxxxxx 
 xxxxxxxxXxxxxxxxxxxxxxXxxxXxxxxxxx;    ;&&&       .:.:;:;:+Xx.:;.+: :+X+&& ::;;:.   : :::..;;:.;.:;;xx::.;.  ;&&$xxxx &&&&+ .+xxxx+ && :+xXxxX& xX; &&&:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx+xxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&&&      :;  :.::::.:;xX:;;:: ;+:x;:x:+;::;;:. .+;xx;;;.;.++;;xx:::+&;    &&$xx &&& .++:.:xx: &&&$+Xxxx&x xXx &&&;;xxxxxxxxxxxxxxxxxxxxxxxxxxxxx++xxx+xxxxx 
 xxxxxxxxx+xxxxxxxxxxxx+xxxxxxxxxxxxxX&&.   : x$XXx;..;:.:::..:.;::.. . :; :.;::;.::;:;::+XXX++;;; ;+:.:$. .$X. . .&&X &&. xx+X& .+;&&  :+xxxX& +xx; &$&x:xxxxxxxXxxxxxxxxxxxxxxxxxxxxxXXXxxxxxxxx 
 Xxxxxxxxxxxxxxxxxxxxxxxx+xxx+xxxxxx&&&   ; . &xx+Xx:.:.:;...::::.;.;:   :.;;x;;x$+.:::;;;:..+;+;;X;+;:xxX+  .;&..  x&X &&     &&+  . :xxxxxx&; xXX; &$X& +xXXxxxxxxxxxxxxxxxxxxxxxxxxX+xxxxxxxxxx 
 xxxxxxxxxxxxxxxxxx++xxxxxxxxxx+xxX&&    :;.;X&X;::;;;:::+.:.....:;++X&$Xx:: :X  .::;;.;;+;;+:++;;;;;;:x&;;&x .XX++.  &$:+&&X&&&&&&++xxxxXxx$& +xxX; &$X&;;xxxxxXxxxxxxxxxxxxxxx+XX+++xxxxxxxxx+xx 
 xx+xxxxxxxxxxxx+xxxxxxxxxxxxxxxx$&&    X. ;& : +++;:++; x.;;X+;+...   ..;;X&$xx+&Xx$&:;:::;::;;+::;+:.;$x:+:;X;;XX;.  +&; ;&&&&   &xxxxxxxx& .:+xx: &XX&$:Xxxxxxxxxxxxxxxxxxxx++xxxxxxxxx+xxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&&+    :+$&& .x;:;;..;..$x+x: .   xXX&++&&$+;;x&xx   ..:;:;;;;;:+X;::+x.;+.:$&&$+ :+$x; x&X:    :xx++xxxxxx$&.+;xxX+ &XX$& xxxXxxxxxxxxxxxxxxxXXxxxxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&&:    x+:$&  &+++:.;+:++x;. ++:XXX$XXX+:    .   ++.:;:;;:;::+;Xx++x;;;+:;;+    &&x$+x: ; +&$xxxxxxxxxx+xxxX&.:;+x+X; &XX$&&:xxxxxxxxxxxxxxx++++xxxxxxxx+xxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxxx&&     +; ++  &$++::;::x;::.;x:;X;;..    .:::::::;;;++;:;;;;::+x+;;;+++;;x;:; &; ;.+.&;;:..  &Xx+x+xxxxxxxxXX$ x++xxX+ &XXX&& xxxxxxxx+Xxx;x+xxxxxxxxxxxxxxxxxxxxx++ 
 xxxxxxxxxxxxxxxxxxxxxxxxxxxx&&   . &&;x&+.X;+x. .+;;.;:  +.:+:::::..:::;::::::..:.:::+::;x;++xX+x++;+;+.+x:&:x&&  x.xX&$$:.&XxxxxxxxxxxxX&.+x+xXx$+ &&&&$&:+xxxxxxxxxxxXX+Xxxxxxxxxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxx&&+ .:  &+&&+&X&x; ..+:. ;:;x;+XX; ..:::;::::+::::;:;:;:::;;;:;+X+x;Xxxx;;:+;:  $& &; ;+ .X  &++&Xxxxxxxxxxxx$& ;+:xxxX  :  $$&X;+xxXXXxxxx++xxxxxxxxxxxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxxX&   .. :& .& ;x: :     ..;. :+;. .::::::::::.;:;;:;;;:;;;;;+;$+;x;x++xxX+++:X;:; &+&&       :; &$&++xxxxxxxxX& +xx++;+& x&&&&$$Xx+;+X++XXXxxxxxxxxxxxx+xxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxxx&&  ..+ x   xx ++;:+x+X;x+:x;;;;..:::::::::;::::::::::::::++;;;;:+++$:::;;;;+X;;.   $ &&&&&$  :   &&+xxxxxxxx$x:++++xxx& X&$XXX$Xxx++xxxxx++xxxxxxxx+xxxxxxxxxxxx+x+xxx 
 xxxxxxxxxxxxxxxxxxxxxxxxx$&  .;:: xx   &++.:::.::..:x:+;x :::;::::::::::;::::::;;:;;;+;:;:::;;x::;;;:.;;x;;; &&&&X&+$&&   X  &:+xxxx+xX& ;++++xx+$ $&XXXX$$xX++xxxxxxxxxxxxx+xxxxxxxxxxxx+xxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxx&$ .:..:. X  :& ;...:.:.   &...; .;::;:;:;:::.::::;;:::;:;;:::;;:;;:.:;;;;;;:+;.:: &&x $X$$XX&&& &&&&X;xxxxxx$;:++++;xx+& &&XXXX$XXXx+++xxxxxx++x+xxxxx+++++xxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxxxX&  :.::;:...  &:X..:..;x+x+:::;x:  .;::::::::::::;::;:;;:;;::;;::;:;;;;::;:;:+xx.  &&&X$$XXx$$X&&&$$&X+xxxxxX$:;++++;x++& &&XXXX$$xx:X+xxx+xxxxxxxxxxxxxxxxxxxxxxxx+xx++ 
 xxxxxxxxxxxxxxxxxxxxxxxx&& .::::.:::.x+ x::.:;xx+.::;:$;. $.  .;.::::::::::::::::;.::;::;:::::::+;;;;:x;  &&;$XXx$&X+x+Xx$$$X& ++xxxX&:;++++++xxX& &&XXXXX$$$X+;++xxxxxxxxxxxxxx+xxxxx+x+++xxx+xx 
 +++X+XxxxxxxxxxxxxX+XxXx&  :;::.::::  ++:.+;+: ::..    .x&;:x. :::::::::+:::.;:::;+::;::;:::;::::;::;;+: &&:$$+;xXX;x$x+xX$xx&&&;xxx$x:x+xxxx+x;;& &&XXXXX$XXX;Xxxxxxxxxxxxx+xxxxxxxx+xxxxxx+xxxx 
 xxxx+xxxxxxxxxxxxxxxxxxX&  .:::::::;..  +;:..  x   ++xX+  ;x&&X;:.: ::::::::;:;:+;:::::::;::;::;.+::;;:: &&+XxXXxx$$+++&xXXX$;&&:xxx&:++x+xxx;+XX& &&$XXX$X$X$Xx++xx+xxxxxxxxxxx+++xxxxx+++xxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxx$&  :.::::::::;:. . +$X;xxX+.;+.:....   ..:$+ .::::::.::;;::;:;:::::+;+;;.+:;;;;+;&&+$&xX$XXxX&$X$$  &X&x:x+X:;x+++x++x+xx& &$XXXX$xXX$xX:++xxxxxxxx+xxxxxxxx+++xxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxx&& ;+.:..::::..:;;..  +;   x:......   .::.+: + ..::::;+::::::::;::+:::;::x;:;+;:  &XX&&&&&&&$&&x X&&&XX&$+x;X+;x++;x+;x+Xx& &&XX$XXxX$XX$$;xx++xxxxxxx++++++xxxxxxxxxxxxxx 
 xxx+x+xxxxxxxxxxxxxxx+x&& ...:::::.::::.:::;:: x++. : ..:++$;.   +;X$;;.:::::::;+x+;:;:::::::;+::;+&;;:  &&&&&$&&xxX+X;&&&&&&&&x++.&X.+xxxxx;x;xx& &&$;$$X$xXx$+;X+xxxx+++++xxxxxxxxxxxxxxxxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxx&& .;::;::::;;::..::..:.:::&&xxX$+.&+Xx+:;+.::+;....:::::.:;;:::;::;::::::.::..:.x&Xx+;:x&x&&&&&&&&&&X&&;x;+&& +x++xx;xxxx& &$$x$XXXXXx$X&::++x+xxxxxxxxxxxxxxxxxxxx++++++ 
 ++x+x+xxxxxxxxxx++xx+xx&& :.::.:.:...:::.....:++::. ...  .: + .X+ X;$+;:: ...:::;.:++;;.:...:::::::::: ;x:     :.x+ :.;.x::  +  $.$&& ;xxx+x+xxxx$ &$$x$$XXXXXXxXxXx+xxxxxxxxxxxxxxxx++++++xxxxxx 
 xxxxxxxxxxxxxxxxxxxxxxx$& ::::::.:::::::;+;:+;....:. +:.: ;..x$x&&   xx+;X&.:::::::. +++;++;::::::;::;:;:$+. ;+X:;: :. .+x +;.. & &&$$:+xxx+;xxxxX &$$x$XXXXXxX$x& +xxxxxxxxxxxxxxxxxxxxxxxxx++++ 
 ++++++++x+++x+x+xx++++xX& . ::::::;:::::.:....:::.. ;;:::$$&&:   :X   .&&$Xx. .:;;;....::..:;;:::;:::+::. +:.:;.:+.;;.x+ +:+:. xx&&xX&.+++xx++xxXx &&XX$$X$X$Xx$x$&.+xxxxxxx+++++xxxx+++++++x++++ 
 xxxxxxxxxxxxxxxxxxxxxxxx&   ::;::::..::::::x:::.:...& x:;:.  ..:: ;&&;    . &+::::;+;x;:;::;+;:;;;;;xx::. .&& ++x;.&+;&+. ;;:. & &$xX&;;xxxxxx;xX: &&XXXX$xxXXXXxx$+;++xxxx+xxxxxx+++xxxx+++++xxx 
 xxxxxxxxxxxxxxxxxxxxx+xx&  ::.:..:::::::::...:::;: x;  ........+.:..:;:::.:  +$;...::::::;;;:++::.....:;;;: :&&;.&.:  .X ::;.  :&&xXX$& ;xxx+XXxX: &&XXXXXX$X$XX$xx$+;+xx++xxxx+++xx+x++++xxxxxxx 
 xxxxxxxxxxxxxxxxxxxxxx++&&  :.:.:::::::::.::::..:..X+ :::.;+:::::.;: : .;;;: ;xXX: .:::;;;.;:;;;;++++:..:..:.  .;:.;::;X :. .  &&$xxXX&::xxx+x;+X ;&$XXXXXXXxXxXx$xx&:+xxxxxxx++xx+++x+xxxxxx+x++ 
 xxxxxxxxxxxxxxxxxxxxx+xxx&  .::::::......:::::::: &:  ::.:.....;::+.::;+;..:;: ::X$.   ..::::::;::::; .+;;::::::;:+++:+X:::+: x&&xXXXX&& +xx;X++x:x&&XXXXX$X$XXXxXxX$x:+xx+x++xx+++x+++xxxxx+++++ 
 xx+xxxxxxxxxxxx+xxxx+xxxx&& .:::;:..:::::......::  & ..;::::::.: .::;.+  .::..     &X:x; .;++;;.::.:;:++;++;+;:::;;::::X+;:: .&&$$X$X$$& ;xx++xxx x&&XX$XXXXX$X$xXXXX$;+x++++x++x+xxxxxxxxxxx+xxx 
 +xxx+x++x+++x++x++xxxxxxxX&   :.:.::::::..:::.:::. .&:  .:.::.:..:..:..+::. :&;xx.+  X XXx  ;.:::;:.::;:.;;:;::;;::.:..+X.+;x&&&&&&&&&&&&&&&&&&&&$ &$$X$XXXXX$$XXXxXX$$ x;X+xxx+++xxxxxxxx+x+xx+x 
 xxxxxxxxxxxxxxxxxxxxxxxxxx&&  .::;.:::;::::::.:.::..;;+  .::::;;;..:.. ; . .;:.;xxx.+&:&$xx.::::::::;::;:x+:;:;+;;:;;  +;.; X                     &&XXX$$$$$Xx&$&X$X$X$X;X+++++++++xxxxx+++x+++++ 
 &&&&&&&&&&&&&&&&&&&&&&&&&&&&&  ........::::.:::::.:. .&+.  . .;:.xx; .;x+;;;; X:+; xX+;&X; .::;::::.::::x:::;:::.;:;. +;;:&&&&&&&&&&&&&&&&&X&&&&&X&&&&&&&&&&&&&&&&&x+x+&+&&&&&&&&&&&&&&&&&&&&&&&& 
                             .. ...:::::::.::...::::.;  &&& :  ::: ;:x;    ..:x; x $x;.x   .::.::::::;:;;;:;::;x::;;. x&+X&&                 .     &             :&&&&&&&                          
 &+Xx:+;::;;x+xx+.X$X$++&&xx.$&  ;...::..:::.::::::.;;.   &&&x   +;: ++;;$x$;x+++++x+.&: ..x:;;;.;:::.:.::;;;::;:;;.  &XXXX:&&&&&&$$+     :    x+  & x$+&Xx;.              &  :: :+.:+x;Xx;:$;+xxx 
 :;;; ;:;:::. .. . .:. .   ::X+&  ::. ..:.:...:....:::...   x&+x  ;;;::;.:+;:.+++;:: .   ::::.::::;:::;:;::::.:.:.x &:X;$&;$ .:   +&&&&&&&&&;&&&Xx$x&          .x &.;  & x&:& .+&+x;:; ... :x.;+;.  
  . x++ +: xXx;Xx;x+:x&x$&X&X$:.XX .Xx ..:;;::::.::::.:::.. .x;&x+.:.:.. ;;;;;;+:x . +:XX;;.:::;::::::::+::::::;: + &$                &&;$ &&$&:&&&&&&&&&&&&&&:         x $X&:;..x:;xxx;+x;+::  .  
 X&&x:&$&&&&X+;X&Xxx+X+       +xX&&   Xx. ..:::;;::..:.:::;  .&X .:x;:;;++;;++;+:+;+xx:.:.+:+::....;::.+.:;::::.   X &&&&&&&&&&&&&&&&&&. .&&&xX:$&   +&&&&&&+. X&&&&&&x ;&;   .X$:x;      :::&$x+$ 
 :. ..           xX..  :;XXX$+x;+:X&    ++;:.:....::::.::.: .xx;::::...::++;::X  ;+::.:..::..::::::.::::;.::;:+. &$+ X     &&&$+;;;;+++X$XxxXX&&&          :+&&X&$&$$&&&&  $x$;;  xx&&&&&&&+;;;++. 
  .:xx&&+$&&&&&&+ ;+.+:X+;xx&&x+++x$&X  ..:::..::::..::::::  +: ;. :...:   .   x+..;:.::.:::::.:::::;;;:::;:;:. &&&&&&&&&&&&xx&&&&&&&&$&&&&$XXXx$&&&&&&&&&&&&$$$$$$XXx&$        ..        .;+.;:+x 
 &&&&X$$XX:+;;x$$X$&&&&&&&&x  X+    x&$   ....:...:.::.:.:.  +X x:;;;;;++:;++x$;;+;x ..:... .:.:.::.: ::::...  x&+x+x:+X$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&x+XX$&.xX&&&&$XX&X$&&XX+x:     :. 
         .       :          ;+Xx&&&&&X&&& . ....:.:::....... ++.::::::::;+++x.  : . ..xX::&X::;;+:::.     ...xx&:                                               X&&&&&&&&& :;$&&&&&:Xx;x$&&&&&&&$& 
 xx+x;.:;XXX+:X$+&:;  .+x::x& $:.. :;     ++:           .... x;;;:;;;;;;+:.. ..  :..:..      .....  X$&&$X&&$+  .$&&&&&&&&&&x&&X:  :XX&&            .&&&&&&&&&&&:                                  
 +&&&&&&&&x+x&&$$&&&&&&&&&&&x ;X$.;  :      :X++XXx+x+;;;    : :;;;:;;:.                 .        $&;. ;&   ;x$&x          $.+. $&&&&: ;XX&&&&$&&&&$&&+&&&$X;.;X&&&X$&&+;:; $&X&&$X&&&$&X&&$xXX;x$ 
                                   ...:;.....     ..   :x&&x$&x;       +:+x$&X$&XX&&&&&&&&&&&&&&&&               : ::;+;.::   ;     . ;&        : ;    . :;$&&      &&$$;xXXXX :X+;;. :x+X$x&&&&&& 
 ;+;+:: xxX+XXXx$xxx;&$$Xx$$&&&&$; :: ..;.::............     . .:;;;;:.                            .;::;:;:::   ..   :..xX&&&&&&&&&&&++&&&&X$&&&$&$;x&&$.X$ +  ;..:.     .   ;$x+ +x&&X:    .:.; X 
 x.&&&+X&&+x&&&&;&&$: .xX&&:+;.  : ....:. . :.............   .: .. ...:::;:;;::;::::::.::.:.:.::... .......;:xX++;;+;: ;            .&X.      ;; .&++x+&&;  :x.&&&&X. $$;xX+.:;.&&$X:+;x$+;;:      
 X&xX;;: .      $$;x&&&X:. && ;x: :;..:;++x++:::::;::::.::++;;:::;;:;;;;::::.;.:;+::.;;;:.::::::.::;;;;;;::::.::+x+$XX&&&xXX$$x:Xx$&:   :;;+&$&XX&&+&&&+ &&&&&.    :&&X.:;:Xx;      .   .+; ..;.;; 
   $  ;&$  ;;x$&      :+;X;  +X$+X;:.:.       .:.....:::;::..::;:::.:;+.;.;:;:;;..;:::;:+:::::::::;;. ::;.::;:::          .+X&&&$&&&x&&&x&&  .:.:;    .:. :X&x&&&&&::.... .$x:xXX&&&xx+XX$X&$&X&&x 
 x;       :.;  :;$&&&&  .;X:;.     .;;;+;+++;+::::::.::::::::::.+::+;;;.;;::::;:;::;+::;:;;;:;;+;;;;+;;;+xx$$x+X+XX$X&&&&&&$$x       . .   ;xX   :X&$. +&&X:   .  x$x&&&&&&+X&x&&&x;xx+   ..       
 +&&&&&&&&&&&&xxX:    :X:   .::.:x+++; .++:::::xxx+xxx+;+;::;;;.....  .: :::..:;:::.::;.:::+;+....;;+;;.       .+$;;+.;;;     .X&&&&&Xx&&&$$&&&&&&+X :&$:X x&&+:.                  .;:x&&$&&&$++X& 
 xx$X;   : :. :$XX;x&;..X;++:  +:.   :;: :              ;:. .:.;.;;;;;;;;;::;;::.:;:::;:;:. ..:;;;:::..+xx+++;x;.         .;.                                   :++x+;:.::.+++;:..          .:;&$: 
      .      .x:+$x:;;xxX&&&&&&$$&$$XX;:::;;;;;;;++xx++;;;;;;;;;;;;;:;: ::::;:;;;:;;;;;;;;++++::::;++;; ::;+;:.:+x+&$+$x&&x&;$&$;;x&Xx;:;:;x+::x+;+x&X&$$$;;$+.: :XX&$$&Xx++:+;++++x&&&&&$++       `;

// 2. The Welding Text (Center-aligned relative to 80 chars is tricky, so we just print it roughly centered or as is)
const weldingLogo = `
  __       __          ___        __                          __       __                 ___        __      
 /\\ \\   __/\\ \\        /\\_ \\      /\\ \\   __                   /\\ \\   __/\\ \\               /\\_ \\      /\\ \\     
 \\ \\ \\/\\ \\ \\ \\      __\\//\\ \\     \\_\\ \\/\\_\\     ___       __   \\ \\ \\/\\ \\ \\ \\     ___    _ __\\//\\ \\     \\_\\ \\    
  \\ \\ \\ \\ \\ \\ \\   /'__\`\\\\ \\ \\    /'_\` \\/\\ \\ /' _ \`\\   /'_ \`\\   \\ \\ \\ \\ \\ \\ \\   / __\`\\/\\\`'__\\\\ \\ \\    /'_\` \\   
   \\ \\ \\_/ \\_\\ \\/\\  __/ \\_\\ \\_/\\ \\L\\ \\ \\ \\/\\ \\/\\ \\/\\ \\L\\ \\   \\ \\ \\_/ \\_\\ \\/\\ \\L\\ \\ \\ \\/  \\_\\ \\_/\\ \\L\\ \\  
    \\ \`\\___x___/\\ \\____\\/\\____\\ \\___,_\\ \\_\\ \\_\\ \\_\\ \\____ \\   \\ \`\\___x___/\\ \\____/\\ \\_\\  /\\____\\ \\___,_\\ 
     '\\/__//__/  \\/____/\\/____/\\/__,_ /\\/_/\\/_/\\/_/\\/___L\\ \\   '\\/__//__/  \\/___/  \\/_/  \\/____/\\/__,_ / 
                                                      /\\____/                                            
                                                      \\/_/__/                                            
`;

// Combine them
const myArt = globeArt + "\n" + weldingLogo;


function playBeep() {
  try { process.stdout.write('\x07'); } catch (e) {}
}

// -----------------------------------------------------------------
// 2. GAME: REACTION TIME
// -----------------------------------------------------------------
async function runReactionGame() {
  return new Promise(async (resolve, reject) => {
    console.clear();
    await typeText(pad(chalk.cyan('SECURITY CHECK: HUMAN REFLEX TEST')), 10);
    await typeText(pad(chalk.cyan('Wait for signal "DRAW!", then press SPACE.')), 10);
    
    const bestTime = getHighScore();
    if (bestTime !== Infinity) console.log(pad(chalk.gray(`CURRENT RECORD: ${bestTime}ms`)));
    console.log(pad(chalk.gray('Get ready...')));

    const delay = Math.floor(Math.random() * 3000) + 2000;
    let canDraw = false;
    let startTime = 0;
    let timeoutId = null;

    timeoutId = setTimeout(() => {
      canDraw = true;
      startTime = Date.now();
      console.log('\n' + pad(chalk.bgRed.white.bold('  DRAW!  ')));
      playBeep();
    }, delay);

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    const keyHandler = (str, key) => {
      if ((key.ctrl && key.name === 'c') || key.name === 'q') {
        clearTimeout(timeoutId);
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.exit(0);
      }
      if (key.name === 'space') {
        if (!canDraw) {
          clearTimeout(timeoutId);
          console.log(pad(chalk.red('\nTOO EARLY! Validation failed.')));
          if (process.stdin.isTTY) process.stdin.setRawMode(false);
          process.exit(0);
        } else {
          const reactionTime = Date.now() - startTime;
          if (process.stdin.isTTY) process.stdin.setRawMode(false);
          process.stdin.removeListener('keypress', keyHandler);
          console.log(pad(chalk.green(`\nNICE! Reaction: ${reactionTime}ms`)));
          if (reactionTime < bestTime) {
            saveHighScore(reactionTime);
            console.log(pad(chalk.yellow.bold(`*** NEW RECORD! ***`)));
            playBeep(); playBeep();
          }
          setTimeout(resolve, 1000);
        }
      }
    };
    process.stdin.on('keypress', keyHandler);
  });
}

// -----------------------------------------------------------------
// 3. NEW ANIMATION: INDIVIDUAL LOADERS
// -----------------------------------------------------------------
async function animateSystemChecks(selections) {
  console.log('\n' + pad(chalk.cyan('INITIALIZING SELECTED SUBSYSTEMS...')));
  
  const prettyNames = {
    'import': 'Drawing Import Module',
    'ai': 'AI Price Core',
    'layout': 'Sheet Opt. Engine',
    'baffle': 'Fluid Dynamics/Baffles',
    'vhull': 'V-Hull Geometry Unit',
    'materials': 'Global Material Feed'
  };

  for (const item of selections) {
    const name = prettyNames[item] || item;
    const barLength = 20;
    
    for (let i = 0; i <= 10; i++) {
      const percent = i * 10;
      const filled = Math.round((barLength * i) / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      
      process.stdout.write(`\r${PADDING}${chalk.cyan('>')} ${name.padEnd(22)} [${chalk.yellow(bar)}] ${percent}%`);
      await new Promise(r => setTimeout(r, 40)); 
    }
    
    process.stdout.write(`\r${PADDING}${chalk.green('✔')} ${name.padEnd(22)} [${chalk.green('█'.repeat(barLength))}] ${chalk.green('OK')}   \n`);
    playBeep();
    await new Promise(r => setTimeout(r, 150)); 
  }
}

// -----------------------------------------------------------------
// 4. MENU & LAUNCH
// -----------------------------------------------------------------
async function runCalculator() {
  console.clear();
  // We use console.log for art instead of typeText because it's massive and takes too long to type char-by-char
  console.log(chalk.cyan(myArt)); 
  await typeText(pad(chalk.cyan('Welcome to the Welding World Calculator Service!\n')), 5);

  const features = [
    { name: 'activate Import Drawing', value: 'import' },
    { name: 'activate AI Predicted Price', value: 'ai' },
    { name: 'activate Sheet Layout Optimizer', value: 'layout' },
    { name: 'activate Baffle Calculator', value: 'baffle' },
    { name: 'activate V-Hull Helper', value: 'vhull' },
    { name: 'activate Material Costs Page', value: 'materials' },
  ];
  
  const { selections } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selections',
      message: 'SYSTEM OFFLINE. Select modules to initialize:',
      choices: features,
      validate: (answer) => {
        if (answer.length < 1) return 'You must select at least one module.';
        return true;
      }
    },
  ]);

  // 1. Animate individual selections
  await animateSystemChecks(selections);

  // 2. Animate Master Power Bar
  console.log();
  await animatePowerBar();

  // 3. Launch
  const featureString = selections.join('&');
  const finalUrl = `${config.MAIN_CALCULATOR_URL}/#${featureString}`;
  console.log(pad(chalk.cyan(`\nSystem Fully Operational. Launching Interface...`)));
  await open(finalUrl);
}

async function animatePowerBar() {
  const totalSteps = 20;
  const barLength = 30;
  for (let i = 0; i <= totalSteps; i++) {
    const percent = Math.round((i / totalSteps) * 100);
    const filledLen = Math.round((barLength * i) / totalSteps);
    const bar = '█'.repeat(filledLen) + '░'.repeat(barLength - filledLen);
    process.stdout.write(`\r${PADDING}${chalk.cyan('Main Power:')} [${chalk.green(bar)}] ${percent}% `);
    playBeep(); 
    await new Promise(r => setTimeout(r, 50));
  }
  console.log(); 
}

// Execution
runReactionGame().then(runCalculator).catch(() => process.exit(0));