const player = document.querySelector('#player');
const mount = document.querySelector('#mount');

// Safari...
const AudioContext = window.AudioContext // Default
	|| window.webkitAudioContext // Safari and old versions of Chrome
	|| false;

const audioContext = new AudioContext();
const mediaElementSource = audioContext.createMediaElementSource(player);

// Very simple function to connect the plugin audionode to the host
const connectPlugin = (instrument, keyboard) => {
	keyboard.audioNode.connectEvents(instrument.instanceId);

	instrument.audioNode.connect(audioContext.destination);
};

// Very simple function to append the plugin root dom node to the host
const mountPlugin = (domNode, keyboard) => {
	mount.innerHtml = '';
	mount.appendChild(keyboard);
	mount.appendChild(domNode);
};

(async () => {
	// Init WamEnv
	const { default: initializeWamHost } = await import("./utils/sdk/src/initializeWamHost.js");
	const [hostGroupId] = await initializeWamHost(audioContext);

	// Import WAM
	const { default: WAM } = await import('./index.js');
	const { default:keyboardWAM}  = await import('https://mainline.i3s.unice.fr/wam2/packages/simpleMidiKeyboard/index.js');

	// Create a new instance of the plugin
	// You can can optionnally give more options such as the initial state of the plugin
	const instanceInstrument = await WAM.createInstance(hostGroupId, audioContext);
	const instanceClavier = await keyboardWAM.createInstance(hostGroupId, audioContext);

	window.instanceInstrument = instanceInstrument;

	// Connect the audionode to the host
	connectPlugin(instanceInstrument, instanceClavier);

	// Load the GUI if need (ie. if the option noGui was set to true)
	// And calls the method createElement of the Gui module
	const pluginDomNode = await instanceInstrument.createGui();
	const keyboardGui = await instanceClavier.createGui();

	mountPlugin(pluginDomNode, keyboardGui);

	player.onplay = () => {
		audioContext.resume(); // audio context must be resumed because browser restrictions
	};
})();
