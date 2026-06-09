const Analysis = {

data: [],

init(data) {
    this.data = data;
},

filter({
    blade = '',
    ratchet = '',
    bit = '',
    place = ''
} = {}) {

    return this.data.filter(r => {

        const bladeMatch =
            !blade ||
            (
                r.上蓋 && r.上蓋.trim()
                    ? r.上蓋 === blade
                    : `【待釐正】(${r.英文})` === blade
            );

        return bladeMatch
            && (!ratchet || r.固鎖 === ratchet)
            && (!bit || r.軸 === bit)
            && (!place || r.名次 === place);

    });

},

countBy(rows, key) {

    const m = {};

    rows.forEach(r => {

        const value = r[key];

        if (!value) return;

        m[value] = (m[value] || 0) + 1;

    });

    return Object.entries(m)
        .sort((a, b) => b[1] - a[1]);

},

getBladeRanking(rows) {

    return this.countBy(rows, '上蓋');

},

getBitRanking(rows) {

    return this.countBy(rows, '軸');

},

getRatchetRanking(rows) {

    const result = this.countBy(rows, '固鎖');

    return result.sort((a, b) => {

        const [a1, a2] = a[0].split('-').map(Number);
        const [b1, b2] = b[0].split('-').map(Number);

        return a1 - b1 || a2 - b2;

    });

},

getTopCombos(rows, limit = 3) {

    const combos = {};

    rows.forEach(r => {

        const blade =
            r.上蓋 && r.上蓋.trim()
                ? r.上蓋
                : `【待釐正】(${r.英文})`;

        const key =
            `${blade}|${r.固鎖}|${r.軸}`;

        if (!combos[key]) {

            combos[key] = {
                blade,
                ratchet: r.固鎖,
                bit: r.軸,
                count: 0
            };

        }

        combos[key].count++;

    });

    return Object.values(combos)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

},

getSummary(rows) {

    return {

        total: rows.length,

        bladeTop:
            this.getBladeRanking(rows)[0]?.[0] || '',

        ratchetTop:
            this.getRatchetRanking(rows)[0]?.[0] || '',

        bitTop:
            this.getBitRanking(rows)[0]?.[0] || ''

    };

},

getPlaceLabel(place) {

    switch (place) {

        case '1st':
            return '🏆 冠軍';

        case '2nd':
            return '🥈 第二';

        case '3rd':
            return '🥉 第三';

        default:
            return '全部';

    }

}

};
