import {detailPage} from '../detailpage/detailpage'

const barcodeContainer = document.querySelectorAll(".barcode")
const barcodeDisplay = document.querySelector(".barcode__display")
const barcodeChecker = document.querySelector(".barcode__checker")

// const startButton = document.querySelector(".barcode__control--start")



const barcodeDiscloser = document.querySelector(".barcode__control--discloser")
const barcodePagecloser = document.querySelector(".barcode__control--pageclose")

const klikImage = document.querySelector(".barcode__control--makeImage");

const testImage = document.querySelector(".testImage")

barcodeDiscloser.addEventListener("click", () => {
	barcodeContainer[0].ariaExpanded = "true";
})

barcodePagecloser.addEventListener("click", () => {
	barcodeContainer[0].ariaExpanded = "false"
})

class barcodeScanner{
	constructor(node){
		this.node = node;
		this.streaming = false;
		this.width = 320;
		this.height = 0;
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
	}

	renderedBindEvents() {
		this.video.addEventListener(
			"canplay",
			() => {
				if (!this.streaming) {
					this.height = this.video.videoHeight / (this.video.videoWidth / this.width);

					this.video.height = this.height
					this.video.width = this.width

					this.canvas.height = this.height
					this.canvas.width = this.width
					this.streaming = true;
				}
			},
			false
		);
	
			
			this.video.addEventListener("timeupdate", () => {
				const context = this.canvas.getContext("2d");
				console.log(context)

				const barcodeDetector = new BarcodeDetector({
					formats: ["ean_13"],
				});
				barcodeDetector
				.detect(this.video)
				.then((barcodes) => {
					context.reset()
					barcodes.forEach((barcode) => {
						if(barcode.rawValue){
							console.log(barcode)
							context.reset()
							context.beginPath();
							context.fillStyle = "rgba(10, 10, 10, 0.5)";
							context.rect(barcode.boundingBox.left / 2, barcode.boundingBox.top / 2 - 20, (barcode.boundingBox.right - barcode.boundingBox.left) / 2, (barcode.boundingBox.bottom - barcode.boundingBox.top) / 2 + 20);  
							context.fill();
							document.querySelector(".support__boolean").textContent = barcode.rawValue
							this.video.pause()
							localStream.getVideoTracks()[0].stop();
							this.streaming = false
							this.startControl().children[0].innerText = "Nieuwe scan"
							this.startControl().classList.add("barcode__control--sec")
							this.controlRedirect().style.display = "flex"

							this.controlRedirect().addEventListener("click", () => {
								this.node.ariaExpanded = "false"
								detailPage(barcode.rawValue)
							})
						} else {
							context.beginPath();
							context.fillStyle = "rgba(10, 10, 10, 0.5)";
							context.rect(0,0,0,0);  
							context.fill();
						}
					})
				})
				.catch((err) => {
					console.error(err);
				}
				);
			})

	}

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
	
	removeListerens = () => {
        Array.from(this.node.children).forEach(item => {
            this.node.replaceChild(item.cloneNode(true), item);
        })
    }

	startup() {
		this.removeListerens()
		this.bindEvents()
		this.video = this.videoOutet();
		this.canvas = this.canvasContext();
				
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

[...barcodeContainer].forEach(barcode => new barcodeScanner(barcode))



		// clearphoto() {
		// 		const context = this.canvas.getContext("2d");
		// 		context.fillStyle = "#AAA";
		// 		context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		// 		const data = this.canvas.toDataURL("image/png");
		// 		this.photo.setAttribute("src", data);
		// 	}

		// 	takepicture() {
		// 		const context = this.canvas.getContext("2d");
		// 		if (this.width && this.height) {
		// 				// this.canvas.width = this.width;
		// 				// this.canvas.height = this.height;
		// 				const test = context.drawImage(this.video, 0, 0, this.width, this.height);
		// 				console.log(test)
						
						
		// 				const data = this.canvas.toDataURL("image/png");
						
		// 				const imageData = context.createImageData(this.width, this.height);
		// 				this.photo.setAttribute("src", data);
		// 				console.log(imageData)
		// 			if (!("BarcodeDetector" in window)) {
		// 				console.log("Barcode Detector is not supported by this browser.");
		// 			} else {
		// 				console.log("Barcode Detector supported!");

			
					
		// 				// create new detector
		// 				const barcodeDetector = new BarcodeDetector({
		// 					formats: ["code_39", "code_93", "codabar", "ean_13"],
		// 				});
		// 				// console.log(data)
		// 				// const testUrl = URL.createObjectURL(data);
		// 				// console.log(testUrl)

		// 				barcodeDetector
		// 				.detect(this.canvas)
		// 				.then((barcodes) => {
		// 						console.log(barcodes)
		// 						barcodes.forEach((barcode) => console.log(barcode.rawValue));
		// 				})
		// 				.catch((err) => {
		// 						console.error(err);
		// 				});
		// 			}
		// 		} else {
		// 			this.clearphoto();
		// 		}
		// 	}
		
			// Set up our event listener to run the startup process
			// once loading is complete.
