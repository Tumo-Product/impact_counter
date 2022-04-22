const view = {
    currentPosition : 334,
    correct         : 0,
    offset          : 110,

    flashWarning: async () => {
        $("#warning").addClass   ("flashWarning");
        await timeout(1500);
        $("#warning").removeClass("flashWarning");
        await timeout(10);
    },
    updateTitle: (text) => {
        $("#title").text(text);
    },
    updateDescription: (text) => {
        $("#description").text(text);
    },
    activateIcon: (i) => {
        $(".block").each(function() {
            $(this).removeClass("inset_shadow");
        });

        $(`#${i}`).addClass("inset_shadow");

        return i;
    },
    addOption: async (option, i) => {
        $(".buttons").append(`
        <div class="border inset_shadow ${option.key}" id="b_${i}" onclick="changeInfo(${i}, '${option.key}')">
            <div class="inside"></div>
            <p class="text">${option.text}</p>
        </div>`);

        if (option.icon !== undefined) {
            $("body").addClass("iconBasedCounter");
            $(`#b_${i}`).prepend(`<img class="optionImage" src="${option.icon}">`);
            $(`#b_${i}`).addClass("hasIcon");
        }
    },
    toggleButton: (i) => {
        if ($(".block.inset_shadow").length === 0) return -1;

        if (activeButton < 0) {
            $(`#b_${i}`).removeClass("inset_shadow");
            $(`#b_${i}`).addClass("outside_shadow");
            $(`#b_${i} .inside`).css("opacity", 0);

            return i;
        } else if (activeButton == i) {
            $(`#b_${i}`).removeClass("outside_shadow");
            $(`#b_${i}`).addClass("inset_shadow");
            $(`#b_${i} .inside`).css("opacity", 1);

            return -1;
        } else if (i != activeButton) {
            $(`#b_${activeButton}`).removeClass("outside_shadow");
            $(`#b_${activeButton}`).addClass("inset_shadow");
            $(`#b_${activeButton} .inside`).css("opacity", 1);

            $(`#b_${i}`).removeClass("inset_shadow");
            $(`#b_${i}`).addClass("outside_shadow");
            $(`#b_${i} .inside`).css("opacity", 0);

            return i;
        }
    },
    addCurrent: (img) => {
        $(".scrollbar").append(`<div onclick="scrollHere(4)" class="block current" id="4"><img src="${href + img}"></div>`);
        if (!dontScroll) $("#4").css("left", `${view.currentPosition}px`);
        else {
            $(`#4`).css({position: "relative", top: 0});
        }
    },
    addOthers: (dir, i, img) => {
        let id = 4 + (dir * i);
        view.addIcon(id, img, dir);
        if (!dontScroll) {
            let newPosition = view.currentPosition + (i * view.offset * dir);
            view.setPosition(id, newPosition);
        }
    },
    scroll: async (amount) => {
        if (amount == 0) return;

        $(`.scrollbar`).css("pointer-events", "none").prop("disabled", true);

        let currentElem = $(".current").index();
        let difference = 7 - currentIcon - amount;

        $(".current").removeClass("current");
        $(`#${currentElem - amount}`).addClass("current");

        $(".scrollbar div").each(function(i) {
            $(this).css("left", amount > 0 ? `+=${amount * view.offset}` : `-=${Math.abs(amount) * view.offset}`);
        });
        
        await timeout(20);

        currentElem = $(".current").index();
        let length = $(".block").length;

        for (let i = 1; i <= Math.abs(amount); i++) {
            let zeroedIndex = i - 1;
            let remove = amount > 0 ? length - i : Math.abs(amount) - i;

            $(`#${remove}`).remove();

            let id       = remove < currentElem ? length + zeroedIndex          : -1 - zeroedIndex;
            let pos      = remove < currentElem ? length + amount + zeroedIndex : amount - i;
            
            let icon;
            if (amount == -1 || amount == 1) {
                icon     = remove < currentElem ? difference + amount - i       : difference + amount + i;
            }
            else if (amount == -2 || amount == 2) {
                icon     = remove < currentElem ? difference - amount + i + 3   : difference - amount - i - 3;
            }
            else if (amount == -3 || amount == 3) {
                icon     = remove < currentElem ? difference - amount + i       : difference - amount - i;
            }

            view.addIcon(id, getIcon(icon).url, -amount);
            
            if (Math.abs(amount) == 1) {
                view.setPosition(id, positions[pos]);
            } else {
                let newPos = remove < currentElem ? positions[pos] + view.offset * 2 : positions[pos] - view.offset * 2;
                view.setPosition(id, newPos);
                await timeout(30);
                view.setPosition(id, positions[pos]);
            }
        }

        await timeout(200);
        view.resetIds();

        setTimeout(() => {
            $(`.scrollbar`).css("pointer-events", "auto").prop("disabled", false);
        }, 200);
    },
    addIcon: (id, img, dir) => {
        if (dir > 0) {
            $(".scrollbar").append (`<div onclick="scrollHere(${id})" class="block" id="${id}"><img src="${href + img}"></div>`);
        } else {
            $(".scrollbar").prepend(`<div onclick="scrollHere(${id})" class="block" id="${id}"><img src="${href + img}"></div>`);
        }

        if (dontScroll) {
            $(`#${id}`).css({position: "relative", top: 0});
        }
    },
    setPosition: (id, newPosition) => {
        $(`#${id}`).css("left", `${newPosition}px`);
    },
    resetIds: () => {
        $(function() { // execute when ready.
            $(".block").each(function(index) {
                $(this).prop("id", index.toString());
                $(this).attr("onclick", `scrollHere(${index})`);
            });
        })
    }
}