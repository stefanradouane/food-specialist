const APIbase = 'https://stefan-the-api-middleman.netlify.app/.netlify/functions/getUser?id='
const myID = 'cldex2mi547qx0av09x25jscf';
const APIendPoint = `${APIbase}${myID}`
// 

const cards = document.querySelectorAll('.card')

let pets = ["🐱", "🐶"];



class Card {
    constructor(node) {
        this.node = node
        this.state = false;
        this.bindEvents()
        this.fetchData()
        this.render()
    }
    
    cardControls() {
        return this.node.querySelectorAll('.card__control')
    }

    cardNames() {
        return this.node.querySelectorAll('.card__name')
    }

    cardLink() {
        return this.node.querySelector('.card__link')
    }

    cardInfo() {
        return this.node.querySelector('.card__info')
    }
    cardEmoji() {
        return this.node.querySelector('.card__emoji')
    }

    carrouselTitle() {
        return this.node.querySelector('.carrousel__title')
    }
    carrouselContent() {
        return this.node.querySelector('.carrousel__content')
    }
    carrouselLink() {
        return this.node.querySelector('.carrousel__link')
    }
    carrouselButtons() {
        return this.node.querySelectorAll('.carrousel__button')
    }

    carrouselAssets() {
        return this.node.querySelectorAll('.carrousel__asset')
    }



    bindEvents() {
        this.cardControls().forEach(control => {
            if(control.classList.contains("card__control--flip")){
                control.addEventListener('click', () => {
                    this.flipCard(!this.state)
                })
            } else if (control.classList.contains("card__control--reload")) {
                control.addEventListener('click', () => {
                    startAnimation()
                    control.classList.add("spin-animation")
                    const remove = () => {
                        control.classList.remove("spin-animation");
                    }
                    setTimeout(remove, 1000)

                })
            }
        })
    
        document.addEventListener('keydown', (e) => {
            if(e.keyCode == 70){
                this.flipCard(!this.state)
            }
        })
    }

    fetchData () {
        fetch(APIendPoint)
        .then(data => data.json())
        .then(({data}) => {
            const user = data[0];
            this.setData(user);
            if(user) {
                this.data = user
                const bio = JSON.parse(this.data.bio.html.replaceAll("<br>", "").replaceAll("&quot;", `"`).replaceAll("&#39;", `'`).replaceAll("<p>", ``).replaceAll("</p>", ``))
                this.data.bio = bio
                let emojis = [this.data.avatar];
                emojis = JSON.parse(this.data.avatar.replaceAll(`'`, `"`))
                pets = emojis
                startAnimation()
                this.cardEmoji().textContent = emojis[Math.floor((Math.random() * emojis.length))]
                this.render()
            }
        })
    }

    setData(user) {
        this.data = user
    }

    flipCard(state) {
        this.state = state;
        if(this.state) {
            this.node.classList.add("card--flipped")
            return
        }
        this.node.classList.remove("card--flipped")
    }

    makeName() {
        const fName = this.data.name;
        const surName = this.data.surname;
        return `${fName} ${surName}`
    }

    render() {
        if(!this.data) {
            console.log("no data yet")
            return
        }
        console.log(this.data)
        this.renderCard()
    }

    renderCard() {
        this.cardNames().forEach(name => name.textContent = this.makeName())
        this.cardLink().href = this.data.website
        this.cardControls().forEach(control => {
            if(control.classList.contains("card__control--git")){
                const currentHref = control.href;

                control.href = currentHref + this.data.gitHubHandle
            }
            return
        })

        // Make carrousel
        Object.keys(this.data.bio).forEach((key, index) => {
            const title = this.data.bio[key].title;
            const content = this.data.bio[key].content;
            const link = this.data.bio[key].link;
            const asset = this.data.bio[key].image ? this.data.bio[key].image.replaceAll("&amp;", "&") : this.data.bio[key].logopath
            const sourceType = this.data.bio[key].image ? "img" : "svg"
            this.carrouselButtons()[index].textContent = key;

            if(index == 0) {
                this.carrouselTitle().textContent = title
                this.carrouselContent().textContent = content
                this.carrouselLink().textContent = link
                this.carrouselLink().href = link

                this.carrouselAssets().forEach(assetSource => {
                    if(sourceType == "svg") {
                        if(assetSource.classList.contains("carrousel__asset--img")){
                            assetSource.style.display = "none"
                        } else {
                            assetSource.children[0].setAttribute("d", asset);
                            assetSource.style.display = "block";
                        }
                    } else {
                        if(assetSource.classList.contains("carrousel__asset--svg")){
                            assetSource.style.display = "none";
                        } else {
                            assetSource.src = asset;
                            assetSource.style.display = "block";
                        }
                    }
                })
            }            

            this.carrouselButtons()[index].addEventListener('click', () => {
                this.carrouselTitle().textContent = title
                this.carrouselContent().textContent = content
                this.carrouselAssets().forEach(assetSource => {
                    if(sourceType == "svg") {
                        if(assetSource.classList.contains("carrousel__asset--img")){
                            assetSource.style.display = "none"
                        } else {
                            assetSource.children[0].setAttribute("d", asset);
                            assetSource.style.display = "block";
                        }
                    } else {
                        if(assetSource.classList.contains("carrousel__asset--svg")){
                            assetSource.style.display = "none";
                        } else {
                            assetSource.src = asset;
                            assetSource.style.display = "block";
                        }
                    }
                })
                if(link) {
                    this.carrouselLink().style.display = "block"
                    this.carrouselLink().textContent = link
                    this.carrouselLink().href = link
                } else {
                    this.carrouselLink().textContent = "noLink"
                    this.carrouselLink().href = "#"
                    this.carrouselLink().style.display = "none"
                }
            })

            if(key == "werk") {
                console.log()
                // console.log(JSON.parse(this.data.bio[key].replaceAll("[", "").replaceAll("]", "").replaceAll(`'`, `"`)))
            }
        })

    }
}

[...cards].forEach(card => new Card(card));

// Card animation background


const effectCanvas = document.querySelector("canvas.card__effect")
effectCanvas.width = effectCanvas.clientWidth;
effectCanvas.height = effectCanvas.clientHeight;

function startAnimation () {
    
    let then, fpsInterval, startTime;


// utilities
const randItem = (i) => i[Math.floor(Math.random() * i.length)];
const rand = (i) => Math.floor(Math.random() * i);
const randBetween = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

// config
const max = 25;
const ctx = effectCanvas.getContext("2d");
const w = effectCanvas.width;
const h = effectCanvas.height;

// make an array of items
const items = new Array(max).fill().map((i) => {
	return {
		x: rand(w),
		y: rand(h),
		p: randItem(pets),
		xs: -4 + Math.random() * 4 + 2,
		ys: Math.random() * 10 + 1,
		fs: randBetween(12, 46)
	};
});

function draw() {
    let now = Date.now();
    
    if((now - startTime) >= 15000){
        return
    }

	ctx.clearRect(0, 0, w, h);
	items.forEach((p) => {
		ctx.font = `${p.fs}px sans-serif`;
		ctx.fillText(p.p, p.x, p.y);
    });
    


	requestAnimationFrame(draw);

	let elapsed = now - then;

	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
	}

	move();
}

function move() {
	items.forEach((p) => {
		p.x += p.xs;
		p.y += p.ys;
		if (p.x > w || p.y > h) {
			p.x = rand(w);
			p.y = -20;
		}
	});
}

function animate(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;

	draw();
}

animate(60);
}



// BACKUP - API data
// {"member":{"id":"cldex2mi547qx0av09x25jscf","slug":"stefan-radouane","name":"Stefan","prefix":"","surname":"Radouane","role":["student"],"nickname":"","avatar":"['🏋🏼‍♂️', '🎵', '🎮', '🛵', '🚗', '⚽', '🍪', '🥛']","gitHubHandle":"stefanradouane","bio":{"html":"{<p></p>\t&quot;portfolio&quot;: {<p></p>\t\t&quot;title&quot;: &quot;Mijn portfolio&quot;,<p></p>\t\t&quot;content&quot;: &quot;Bekijk mijn portfolio&quot;,<p></p>\t\t&quot;link&quot;: &quot;https://stefanradouane.nl&quot;<p></p>\t},<p></p>\t&quot;werk&quot;: {<p></p>\t\t&quot;title&quot;: &quot;Maykin Media&quot;,<p></p>\t\t&quot;content&quot;: &quot;Momenteel werk ik bij Maykin Media&quot;,<p></p>\t\t&quot;link&quot;: &quot;https://maykinmedia.nl&quot;<p></p>\t},<p></p>\t&quot;hobby&quot;: {<p></p>\t\t&quot;title&quot;: &quot;Mijn hobby&#39;s&quot;,<p></p>\t\t&quot;content&quot;: &quot;Info over mijn hobby&#39;s&quot;,<p></p>\t\t&quot;link&quot;: false<p></p>\t},<p></p>\t&quot;mystery&quot;: {<p></p>\t\t&quot;title&quot;: &quot;It&#39;s a Mystery&quot;,<p></p>\t\t&quot;content&quot;: &quot;Still hidden&quot;,<p></p>\t\t&quot;link&quot;: false<p></p>\t}<p></p>}"},"website":"https://stefanradouane.nl","squads":[{"name":"Minor Web","slug":"minor-web-2023","cohort":"2023","website":null}]}}