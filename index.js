let height;

let heightFinder;
let filler;
let intro;
let projects;
let projectsEntryEnd;

let projectItemScrollTop;
let projectItems;
let projectsList;
let projectImagesList;
let projectItemsMoveEnd;

let clients, clientsList;
let clientsCount, clientsListScroll;
let clientsEntryEnd;

const setupIntroAnim = () => {
	intro = document.getElementById('intro');
}
const doIntroAnim = (y) => {
	if(y > height*0.7) {
		intro.classList.add('show');
		setTimeout(() => intro.classList.add('transit'), 100);
	} else
		intro.classList.add('transit', 'show');
}

const setupProjectsAnim = () => {
	projects = document.getElementById('projects');
}
const initProjectsAnim = () => {
	projectsEntryEnd = height;
}
const moveProjectsAnim = (y) => {
	let progress;
	if(y < projectsEntryEnd)
		progress = y/projectsEntryEnd;
	else
		progress = 1
	projects.style.top = ((1-progress)*height)+'px';
	intro.style.top = (-progress*height)+'px';
}

const setupProjectItemsAnim = () => {
	projectList = document.querySelector('.projects-list');
	projectItems = projects.querySelectorAll('.projects-item');
	projectImages = projects.querySelectorAll('.projects-item img');
}
const initProjectItemsAnim = () => {
	projectItemsMoveEnd = projectsEntryEnd + projectList.offsetHeight * (projectItems.length-1);
	projectItemScrollTop = ((projectItems[0]?.offsetHeight || 0) + (projectItems[0]?.querySelector('.img')?.offsetHeight || 0)*0.1)/projectList.offsetHeight;
}
const moveProjectItemsAnim = (y) => {
	let progress;
	if(y < projectsEntryEnd)
		progress = 0;
	else if(y < projectItemsMoveEnd)
		progress = (y - projectsEntryEnd) / (projectItemsMoveEnd - projectsEntryEnd)
	else
		progress = 1;

	progress *= (projectItems.length - 1);
	for(let i=0; i<projectItems.length; i++) {
		const item = projectItems[i];
		if(progress < i) {
			item.style.top = (i - progress) * projectItemScrollTop * 100 +'%';
			item.style.opacity = 1;
			item.style.transform = 'scale(1)';
			item.dataset.scale = 1;
		} else if(progress < i+1) {
			item.style.top = '0%';
			item.style.opacity = 1 - progress + i;
			item.style.transform = 'scale('+(1 - (progress - i)*0.5)+')';
			item.dataset.scale = (1 - (progress - i)*0.5);
		} else {
			item.style.top = '0%'
			item.style.opacity = 0;
			item.style.transform = 'scale(0.5)';
			item.dataset.scale = 0;
		}
	}
}

const setupClientsAnim = () => {
	clients = document.getElementById('clients');
	clientsList = clients.querySelector('.list');
	clientsListScroll = clientsList.parentElement;
	clientsCount = clientsList.children.length;
	clientsListScroll.scrollTo({left: clientsList.offsetWidth/2 - clientsListScroll.offsetWidth/2, top: 0, behaviour: 'smooth'});
	clientsListScroll.dataset.scroll = clientsList.offsetWidth/2 - clientsListScroll.offsetWidth/2;
	clientsListScroll.dataset.gap = 28;
}
const initClientsAnim = () => {
	clientsEntryEnd = projectItemsMoveEnd + height;
}
const moveClientsAnim = (y) => {
	let progress;
	if(y < projectItemsMoveEnd)
		progress = 0;
	else if(y < clientsEntryEnd)
		progress = (y-projectItemsMoveEnd)/(clientsEntryEnd - projectItemsMoveEnd);
	else if(y < footerEntryEnd)
		progress = 1 + (y-clientsEntryEnd)/(footerEntryEnd - clientsEntryEnd);
	else
		progress = 2;
	clients.style.top = (1-progress)*100+'vh';
	const gap = 28 + (progress > 1 ? 0 : (1 - Math.cos((1 - progress) * Math.PI/2))) * 16*14
	const scroll = parseFloat(clientsListScroll.dataset.scroll) - (parseFloat(clientsListScroll.dataset.gap) - gap)*(clientsCount/2 - (clientsCount%1?0:0.5))
	clientsListScroll.scrollTo(scroll, 0);
	clientsListScroll.dataset.scroll = scroll;
	clientsListScroll.dataset.gap = gap;
	clientsList.style.gap = gap+'px'
	projects.style.opacity = 1 - Math.min(progress, 1);
}

const setupFooterAnim = () => {
	footer = document.getElementById('footer');
}
const initFooterAnim = () => {
	footerEntryEnd = clientsEntryEnd + footer.offsetHeight;
	footerHeight = footer.offsetHeight;
}
const moveFooterAnim = (y) => {
	let progress;
	if(y < clientsEntryEnd)
		progress = 0;
	else if(y < footerEntryEnd)
		progress = (y-clientsEntryEnd)/(footerEntryEnd - clientsEntryEnd);
	else
		progress = 1
	footer.style.top = (height - progress * footerHeight) + 'px';
}

const moveProjectItemImagesAnim = (y) => {
	let progress;
	if(y < projectsEntryEnd)
		progress = y / projectsEntryEnd - 1;
	else if(y < projectItemsMoveEnd)
		progress = (y - projectsEntryEnd) / (projectItemsMoveEnd - projectsEntryEnd) * (projectItems.length - 1)
	else if(y < clientsEntryEnd)
		progress = projectItems.length - 1 + (y - projectItemsMoveEnd) / (clientsEntryEnd - projectItemsMoveEnd)
	else
		progress = projectItems.length;


	for(let i=0; i<projectImages.length; i++) {
		const item = projectImages[i];
		if(progress < i-1)
			item.style.transform = 'scale(2)';
		else if(progress < i)
			item.style.transform = `scale(${(1 - Math.cos((i - progress) * Math.PI/2))*1 + 1})`
		else if(progress < i+1)
			item.style.transform = `scale(${(1 - Math.cos((progress - i) * Math.PI/2))*1 + 1})`
		else
			item.style.transform = `scale(2)`
	}
}

document.addEventListener('DOMContentLoaded', () => {
	heightFinder = document.getElementById('height-finder');
	height = heightFinder.offsetHeight;
	filler = document.getElementById('filler');
	setupIntroAnim();
	setupProjectsAnim();
	setupProjectItemsAnim();
	setupClientsAnim();
	setupFooterAnim();
	window.addEventListener('load', () => {

		doIntroAnim();
		initProjectsAnim();
		initProjectItemsAnim();
		initClientsAnim();
		initFooterAnim();

		filler.style.height = footerEntryEnd + height + 'px'

		moveProjectsAnim(window.scrollY);
		moveProjectItemsAnim(window.scrollY);
		moveClientsAnim(window.scrollY);
		moveFooterAnim(window.scrollY);
		moveProjectItemImagesAnim(window.scrollY);

		setTimeout(() => {
			document.body.classList.add('transit');
		}, 100);
		
		window.addEventListener('scroll', () => {
			moveProjectsAnim(window.scrollY);
			moveProjectItemsAnim(window.scrollY);
			moveClientsAnim(window.scrollY);
			moveFooterAnim(window.scrollY);
			moveProjectItemImagesAnim(window.scrollY);
		});
	});

	clientsListScroll.addEventListener('scroll', e => {
		clientsListScroll.dataset.scroll = clientsListScroll.scrollLeft;
	});

	document.querySelectorAll('.projects-item').forEach(i => {
		const hover = i.querySelector('.hover')
		if(hover) {
			i.addEventListener('pointerenter', e => {
				hover.style.display = 'flex'
				const pos = i.getClientRects()[0];
				hover.style.top = (e.clientY - pos.top) / parseFloat(i.dataset.scale)+'px'
				hover.style.left = (e.clientX - pos.left) / parseFloat(i.dataset.scale)+'px'
			});
			i.addEventListener('pointerleave', e => {
				hover.style.display = 'none'
			});
			i.addEventListener('pointermove', e => {
				const pos = i.getClientRects()[0];
				hover.style.top = (e.clientY - pos.top) / parseFloat(i.dataset.scale)+'px'
				hover.style.left = (e.clientX - pos.left) / parseFloat(i.dataset.scale)+'px'
			})
			i.addEventListener('pointerover', e => {
				const pos = i.getClientRects()[0];
				hover.style.top = (e.clientY - pos.top) / parseFloat(i.dataset.scale)+'px'
				hover.style.left = (e.clientX - pos.left) / parseFloat(i.dataset.scale)+'px'
			})
		}
	});
});
