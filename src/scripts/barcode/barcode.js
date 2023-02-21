import {detailPage} from '../detailpage/detailpage'

const barcodeContainer = document.querySelectorAll(".barcode")
const barcodeDisplay = document.querySelector(".barcode__display")
const barcodeChecker = document.querySelector(".barcode__checker")
const audio = new Audio("./public/assets/sounds/scan.wav")



// const startButton = document.querySelector(".barcode__control--start")



const barcodeDiscloser = document.querySelector(".barcode__control--discloser")
const barcodePagecloser = document.querySelector(".barcode__control--pageclose")

const klikImage = document.querySelector(".barcode__control--makeImage");

const testImage = document.querySelector(".testImage")



class barcodeScanner{
	constructor(node){
		this.node = node;
		this.streaming = false;
		// this.width = 300;
		// this.height = 0;
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
					// this.height = this.video.videoHeight / (this.video.videoWidth / this.width);

					// this.video.height = this.height
					// this.video.width = this.width

					// this.canvas.height = this.height
					// this.canvas.width = this.width
					this.streaming = true;
				}
			},
			false
		);
	
			
			this.video.addEventListener("timeupdate", () => {
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

							console.log(barcode)
							

							return {
								"x": barcode.boundingBox.x / 2, 
								"y": barcode.boundingBox.y / 2, 
								"height": barcode.boundingBox.height,
								"width": barcode.boundingBox.width / 2
							}
						} 

						// const 
						
						// else {
						// 	context.beginPath();
						// 	context.fillStyle = "rgba(10, 10, 10, 0.5)";
						// 	context.rect(0,0,0,0);  
						// 	context.fill();
						// }
					})

					const gecombineerdObject = {};

					// Voor elke property in het eerste object
					

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
		
						console.log(gecombineerdObject);

						console.log(context)

						context.reset()
						context.beginPath();
						context.fillStyle = "rgba(10, 10, 10, 1)";
						context.rect(gecombineerdObject.x, gecombineerdObject.y, gecombineerdObject.width, gecombineerdObject.height);  
						context.fill();
						

						console.log("we got one")
						this.video.pause()
						localStream.getVideoTracks()[0].stop();
						this.streaming = false
						this.startControl().children[0].innerText = "Nieuwe scan"
						this.startControl().classList.add("barcode__control--sec")
						this.controlRedirect().style.display = "flex"
						audio.play()

						this.controlRedirect().addEventListener("click", () => {
							this.node.ariaExpanded = "false"
							detailPage(this.controlRedirect().value)
						})
					}

					// Do function logic
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

	disCloser () {
		return document.querySelector(".barcode__control--discloser")
	}

	pageCloser () {
		return this.node.querySelector(".barcode__control--pageclose")

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
