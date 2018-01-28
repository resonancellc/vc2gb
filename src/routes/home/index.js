import Dropzone from 'react-dropzone';
import { h, Component } from 'preact';
import { first, partial, camelCase, upperFirst } from 'lodash-es';
import { binaryStringToBlob, blobToArrayBuffer, createObjectURL } from 'blob-util';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';

const vcSize = 32784;
const retailSize = 32768;

export default class Home extends Component {

	constructor() {
		super();
		this.state = {
			convertFrom: 'virtual console',
			convertTo: 'retail',
			convertFunc: this.convertVirtualConsole,
			convertIcon: 'chicorita.png'
		};
	}

	convertSave(convertFrom, saveBuffer) {
		switch (convertFrom) {
			case 'vc':
				return saveBuffer.slice(0, retailSize);
			case 'retail':
			default:
				// Some emulators increase the save size, so we trim it to the proper size
				const trimmedSave = saveBuffer.slice(0, retailSize);
				const newSave = new Uint8Array(vcSize);
				newSave.set(trimmedSave);
				return newSave;
		}
	}

	downloadSave(convertFrom, saveUrl) {
		const downloadElement = document.getElementById('download');
		const fileName = convertFrom === 'vc' ? 'PokemonCrystal.sav' : 'sav.dat';
		downloadElement.href = saveUrl;
		downloadElement.download = fileName;
		downloadElement.click();
	}

	onDrop(convertFrom, files) {
		const save = first(files);
		const convertSave = partial(this.convertSave, convertFrom);
		const downloadSave = partial(this.downloadSave, convertFrom);
		const newUint8Array = (data) => new Uint8Array(data);
		const newBlob = (data) => new Blob([data], { type: 'application/octet-binary' });
		const reader = new FileReader();

		reader.onload = () => {
			const { result: saveBinary } = reader;
			binaryStringToBlob(saveBinary)
				.then(blobToArrayBuffer)
				.then(newUint8Array)
				.then(convertSave)
				.then(newBlob)
				.then(createObjectURL)
				.then(downloadSave);
		};

		reader.readAsBinaryString(save);
	}

	switchConvertType(compareString) {
		return compareString === 'virtual console' ? 'retail' : 'virtual console';
	}

	toggleConvert() {
		const { convertFrom: previousFrom, convertTo: previousTo, convertIcon: previousIcon } = this.state;
		const convertFrom = this.switchConvertType(previousFrom);
		const convertTo = this.switchConvertType(previousTo);
		const convertFunc = this[`convert${upperFirst(camelCase(convertFrom))}`];
		const convertIcon = previousIcon === 'chicorita.png' ? 'meganium.png' : 'chicorita.png';

		this.setState({
			convertFrom,
			convertTo,
			convertFunc,
			convertIcon
		});
	}

	convertVirtualConsole = partial(this.onDrop, 'vc');
	convertRetail = partial(this.onDrop, 'retail');

	render({ convertFrom }) {
		return (
			<div class={style.home}>
				<Dropzone onDrop={this.state.convertFunc.bind(this)} className={style.dropzone}>
					<img src={`assets/${this.state.convertIcon}`} class={style.uploadIcon} />
					<h3 class={style.centerText}>Drop your {this.state.convertFrom} save here</h3>
				</Dropzone>
				<div class={style.switchSpace}>
					<Switch onClick={this.toggleConvert.bind(this)} />
					<label class={style.switchLabel}>Convert {this.state.convertFrom} to {this.state.convertTo}</label>
				</div>
				<a id="download" hidden />
			</div>
		);
	}
}
