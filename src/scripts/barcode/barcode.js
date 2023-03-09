import {detailPage} from '../detailpage/detailpage'

const barcodeContainer = document.querySelectorAll(".barcode")
const audio = new Audio("./public/assets/sounds/scan.wav")

class barcodeScanner{
	constructor(node){
		this.node = node;
		this.streaming = false;
		this.video = null;
		this.canvas = null;
		this.startButton = null;
		this.render()
	}

	bindEvents() {
		this.startControl().addEventListener("click", () => {
			if(!this.streaming){
				this.startup() 
				document.querySelector(".support__boolean").textContent = "geen"
				this.controlRedirect().style.display = "none"
				this.startControl().classList.remove("barcode__control--sec")
			} else {
				if(this.streaming){
					localStream.getVideoTracks()[0].stop();
					this.streaming = false;
					this.startControl().children[0].innerText = "Start met scannen"
					document.querySelector(".support__boolean").textContent = "geen"
					this.controlRedirect().style.display = "none"
					this.startControl().classList.remove("barcode__control--sec")
				}
			}
		})

		this.disCloser().addEventListener("click", () => {
			this.node.ariaExpanded = "true";
		})
		
		this.pageCloser().addEventListener("click", () => {
			barcodeContainer[0].ariaExpanded = "false"
		})
	}

	renderedBindEvents() {
		this.video.addEventListener(
			"canplay",
			() => {
				if (!this.streaming) {
					this.streaming = true;
				}
			},
			false
		);
	
		this.video.addEventListener("timeupdate", () => {
			// Display video on canvas
			const context = this.canvas.getContext("2d");
			const barcodeDetector = new BarcodeDetector({
				formats: ["ean_13"],
			});
			barcodeDetector
			.detect(this.video)
			.then((barcodes) => {
				let barcodeCheck = false;
				let boundingBoxes = barcodes.map((barcode, i) => {
					if(barcode.rawValue){
						barcodeCheck = true
						document.querySelector(".support__boolean").textContent = barcode.rawValue
						this.controlRedirect().value = barcode.rawValue

						return {
							"x": barcode.boundingBox.x / 2, 
							"y": barcode.boundingBox.y / 2, 
							"height": barcode.boundingBox.height,
							"width": barcode.boundingBox.width / 2
						}
					} 
				})

				const gecombineerdObject = {};

				// We have a hit!
				if(barcodeCheck){
					for (let prop in boundingBoxes[0]) {
						let som = 0;
	
						// Voor elk object in de array
						for (let i = 0; i < boundingBoxes.length; i++) {
							som += boundingBoxes[i][prop];
						}
	
						// Bereken het gemiddelde en wijs het toe aan de nieuwe property
						gecombineerdObject[prop] = som / boundingBoxes.length;
					}

					// Reset context
					context.reset()
					// Make an rect on the selected aria
					context.beginPath();
					context.fillStyle = "rgba(10, 10, 10, 1)";
					context.rect(gecombineerdObject.x, gecombineerdObject.y, gecombineerdObject.width, gecombineerdObject.height);  
					context.fill();
					// Pause video
					this.video.pause()
					// Stop using the webcam / camera
					localStream.getVideoTracks()[0].stop();
					// Set streaming false
					this.streaming = false
					// Play audio
					audio.play()

					this.startControl().children[0].innerText = "Nieuwe scan"
					this.startControl().classList.add("barcode__control--sec")
					this.controlRedirect().style.display = "flex"

					// Open detailpage on click
					this.controlRedirect().addEventListener("click", () => {
						this.node.ariaExpanded = "false"
						detailPage(this.controlRedirect().value)
					})
				}
			})
			.catch((err) => {
				console.error(err);
			}
			);
		})

	}

	// Getters
	startControl () {
		return this.node.querySelector(".barcode__control--start")
	}

	videoOutet () {
		return this.node.querySelector(".barcode__video")
	}

	canvasContext () {
		return this.node.querySelector(".barcode__display")
	}

	controlRedirect () {
		return this.node.querySelector(".barcode__control--redirect")
	}

	disCloser () {
		return document.querySelector(".barcode__control--discloser")
	}

	pageCloser () {
		return this.node.querySelector(".barcode__control--pageclose")

	}
	
	// Reset all items
	removeListerens = () => {
        Array.from(this.node.children).forEach(item => {
            this.node.replaceChild(item.cloneNode(true), item);
        })
    }

	// Start
	startup() {
		// Remove listeners
		this.removeListerens()
		// Fix listeners
		this.bindEvents()
		// Set objects
		this.video = this.videoOutet();
		this.canvas = this.canvasContext();
				
		// If not streaming ask permission
		if(!this.streaming){
			navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				window.localStream = stream;
				this.video.srcObject = stream;
				this.video.play();
				this.startControl().children[0].innerText = "Annuleer"
				this.renderedBindEvents()
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});
		}
	}


	render(){
		this.bindEvents()
	}
}

// Start!
[...barcodeContainer].forEach(barcode => new barcodeScanner(barcode))