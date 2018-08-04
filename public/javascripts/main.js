import * as Vibrant from 'node-vibrant';

$(()=>{
    $('[vibrant]').each((i, elem) => {
        console.log(elem);
        Vibrant.from(elem.getAttribute('src')).getPalette((err, palette) => {
            const bgColor = palette.LightVibrant?palette.DarkVibrant.getHex():palette.DarkMuted.getHex();
            const color = palette.LightVibrant?palette.LightVibrant.getHex():palette.LightMuted.getHex();

            $(elem).closest('.card').css('background-color', bgColor);
            $(elem).closest('.card').css('color', color);
        })
    });

    $(document).foundation();
});
