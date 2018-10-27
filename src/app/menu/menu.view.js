var renderMenu = function (state) {
    return `${renderMenuButton(PICK_IMAGE_TITLE, "Actions.clickChooseBaseImage()", true)}
        ${renderMenuButton(CLUSTER_COLORS_TITLE, "Actions.clickClusterColors()", state.chooseImage.imageLoaded)}
        ${renderMenuButton(SUPER_PIXEL_TITLE, "Actions.clickSuperPixels()", state.chooseImage.imageLoaded)}`;
};

var renderMenuButton = function (text, action, visible) {
    if (!visible) { return ''; }
    return `<button class="w3-button w3-round" onclick="${action}">${text}</button>`;
}