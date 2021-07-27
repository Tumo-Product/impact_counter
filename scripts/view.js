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
    toggleButton: (i) => {
        if (activeIcon == -1) return -1;

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
        $("#4").css("left", `${view.currentPosition}px`);
    },
    addOthers: (dir, i, img) => {
        let id = 4 + (dir * i);

        if (dir > 0) {
            view.addIcon(id, img, dir);
            let newPosition = view.currentPosition + (i * view.offset);
            view.setPosition(id, newPosition);
        } else {
            view.addIcon(id, img, dir);
            let newPosition = view.currentPosition - (i * view.offset);
            view.setPosition(id, newPosition);
        }
    },
    scroll: async (amount) => {
        if (amount == 0) return;
        scrolling = true;

        let current    = $(".current").index();
        let difference = 7 - current - amount;

        $(".current").removeClass("current");
        $(`#${current - amount}`).addClass("current");

        $(".scrollbar div").each(function(i) {
            $(this).css("left", amount > 0 ? `+=${amount * view.offset}` : `-=${Math.abs(amount) * view.offset}`);
        });

        await timeout(50);

        current = $(".current").index();

        let length = $(".block").length;

        for (let i = 1; i <= Math.abs(amount); i++) {
            let zeroedIndex = i - 1;
            let remove = amount > 0 ? length - i : Math.abs(amount) - i;

            $(`#${remove}`).remove();

            let id       = remove < current ? length + zeroedIndex          : -1 - zeroedIndex;
            let pos      = remove < current ? length + amount + zeroedIndex : amount - i;
            let icon     = remove < current ? currentIcon - difference - i  : currentIcon + difference + i;

            view.addIcon(id, getIcon(icon).url, -amount);
            
            if (Math.abs(amount) == 1) {
                view.setPosition(id, positions[pos]);
            } else {
                let newPos = remove < current ? positions[pos] + (view.offset * i + 15) : positions[pos] - (view.offset * i);
                view.setPosition(id, newPos);
                await timeout(50);
                view.setPosition(id, positions[pos]);
            }
        }

        await timeout(200);
        view.resetIds();
        scrolling = false;
    },
    addIcon: (id, img, dir) => {
        if (dir > 0) {
            $(".scrollbar").append (`<div onclick="scrollHere(${id})" class="block" id="${id}"><img src="${href + img}"></div>`);
        } else {
            $(".scrollbar").prepend(`<div onclick="scrollHere(${id})" class="block" id="${id}"><img src="${href + img}"></div>`);
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