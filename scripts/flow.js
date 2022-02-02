const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let textButtons;
let currentIcon = 1;
let scrolling   = false;
let dontScroll  = false;
let positions   = [];

let activeButton = -1;
let activeIcon   = -1;

let flashDone = false;

jQuery.event.special.wheel = {
    setup: function( _, ns, handle ) {
        this.addEventListener("wheel", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

const onPageLoad = async () => {
    data = await parser.dataFetch();
    textButtons = data.data.data.texts;
    data = data.data.data;
    
    if (data != undefined) {
        data = data.elements;
        
    } else {
        console.log("Uid not available");
        return;
    }

    $(`#firstButtons`).css("display", "flex");
    $(`#secondButtons`).css("display", textButtons === undefined ? "none" : "flex");
    if (textButtons !== undefined) {
        $("body").addClass("sixR");
        await timeout(1000);
    }

    // currentIcon = Math.floor(Math.random() * data.length - 1);

    let sidesCount = Math.floor((data.length - 1) / 2);
    if (sidesCount < 4) {
        dontScroll = true;

        for (let i = 0; i < data.length; i++) {
            view.addIcon(i, data[i].url, 1);
        }
    } else {
        view.addCurrent(getIcon(currentIcon).url);

        if (sidesCount > 4) {
            sidesCount = 4;
        }
        for (let i = 1; i <= sidesCount; i++) {
            view.addOthers( 1, i, getIcon(currentIcon + i).url);
            view.addOthers(-1, i, getIcon(currentIcon - i).url);
        }
    
        $(".block").each(function (i) {
            positions[i] = $(this).position().left;
        });
    
        $(".scrollbar").on('wheel', async function (e) {
            if (scrolling) {
                return;
            }
            if (!scrolling) {
                scrolling = true;
                wheel(e);
            }
    
            setTimeout(() => {
                scrolling = false;
            }, 500);
        });
    }

    loader.toggle();
}

const changeInfo = (i, infoType) => {
    if (flashDone) {
        $("#warning").css("opacity", 0);
    }

    activeButton = view.toggleButton(i);

    if (activeIcon == -1 || activeIcon == undefined) return;

    if (activeButton == -1) {
        view.updateDescription(getIcon(activeIcon).description);
    } else {
        view.updateDescription(getIcon(activeIcon).info[infoType]);
    }
}

const flashWarning = async (length) => {
    if (textButtons === undefined) {
        $("#warning").text(`Maintenant choisis l'une des 3 options.`);
    } 
    else {
        $("#warning").text(`Maintenant choisis l'une des 6 options.`);
    }
    
    for (let i = 0; i < length; i++) {
        await view.flashWarning();
    }
    
    $("#warning").css("opacity", 1);
}

const wheel = async (e) => {
    let dir = -Math.sign(e.originalEvent.wheelDelta);
    currentIcon += dir;
    await view.scroll(dir);
}

const scrollHere = async(i) => {
    if (!scrolling) {
        scrolling = true;

        activeButton = view.toggleButton(activeButton);
        activeIcon  = dontScroll ? view.activateIcon(i) : view.activateIcon(i) - currentIcon - 2;
        if (!dontScroll) {
            let amount = -(i - $(".current").index());
            currentIcon += amount;
            await view.scroll(amount);
        }

        if (!flashDone) {
            flashWarning(1);
            flashDone = true;
        }

        let element = dontScroll ? data[activeIcon] : getIcon(activeIcon);
        view.updateTitle      (element.title);
        view.updateDescription(element.description);
    }

    setTimeout(() => {
        scrolling = false;
    }, 500);
}

const getIcon = (newIndex) => {
    newIndex %= data.length;
    
    if (newIndex < 0) {
        newIndex = data.length + newIndex;
    }
    else if (newIndex > data.length) {
        newIndex = 0;
    }
    return data[newIndex];
}

$(onPageLoad);