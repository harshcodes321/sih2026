/* ============================================
   NĪRA-GARBHA SENSOR CONTROL SYSTEM
   JavaScript
============================================ */


/* ============================================
   BASIC HELPERS
============================================ */

function $(id) {
    return document.getElementById(id);
}


function showToast(message) {

    const toast = $("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* ============================================
   PAGE NAVIGATION
============================================ */

const navigationButtons =
    document.querySelectorAll(".nav-btn");


const pages =
    document.querySelectorAll(".page");


navigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        navigationButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        pages.forEach(page => {

            page.classList.remove("active");

        });


        const pageName =
            button.getAttribute("data-page");

        $(pageName).classList.add("active");


        $("pageTitle").innerText =
            button.innerText
            .replace(/[◈⌁⌖◎▤⚙]/g, "")
            .trim();


        if (pageName === "mapping") {

            setTimeout(() => {

                if (map2) {
                    map2.invalidateSize();
                }

            }, 200);

        }


        if (pageName === "dashboard") {

            setTimeout(() => {

                if (map) {
                    map.invalidateSize();
                }

            }, 200);

        }

    });

});


/* ============================================
   MAP
============================================ */

let map;
let map2;


const sensorPath = [

    [-38.1900, 74.8050],

    [-38.1920, 74.8110],

    [-38.1945, 74.8170],

    [-38.1970, 74.8230],

    [-38.1986, 74.8244],

    [-38.1998, 74.8270],

    [-38.2012, 74.8301],

    [-38.2030, 74.8350],

    [-38.2050, 74.8410],

    [-38.2070, 74.8470]

];


const anomalies = [

    {
        position: [-38.2012, 74.8301],
        score: 72,
        label: "A-17 High Priority"
    },

    {
        position: [-38.1986, 74.8244],
        score: 54,
        label: "A-16 Medium Priority"
    },

    {
        position: [-38.1951, 74.8180],
        score: 28,
        label: "A-15 Low Priority"
    },

    {
        position: [-38.1918, 74.8112],
        score: 47,
        label: "A-14 Medium Priority"
    }

];


function createMap(elementID) {

    const newMap =
        L.map(elementID)
        .setView(
            [-38.198, 74.826],
            10
        );


    const oceanTiles = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, SECON, SeaFloor",
            maxZoom: 13
        }
    );

    const satelliteTiles = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
            maxZoom: 18
        }
    );

    const darkTiles = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
            maxZoom: 16
        }
    );

    // Add Ocean Bathymetry as default layer
    oceanTiles.addTo(newMap);

    L.control.layers({
        "🌊 Ocean Bathymetry": oceanTiles,
        "🛰️ Satellite Imagery": satelliteTiles,
        "🌌 Dark Canvas": darkTiles
    }, null, { position: 'topright' }).addTo(newMap);


    /* SENSOR PATH */

    L.polyline(
        sensorPath, {
            color: "#27d7e8",
            weight: 4,
            opacity: 0.9
        }
    ).addTo(newMap);


    /* SENSOR POSITIONS */

    sensorPath.forEach(
        (position, index) => {

            L.circleMarker(
                    position, {
                        radius: 4,
                        color: "#2587ff",
                        fillColor: "#2587ff",
                        fillOpacity: 1
                    }
                )
                .bindTooltip(
                    "Survey Point " +
                    (index + 1)
                )
                .addTo(newMap);

        }
    );


    /* ANOMALIES */

    anomalies.forEach(anomaly => {

        L.circleMarker(
                anomaly.position, {
                    radius: 9,
                    color: "#ff6174",
                    fillColor: "#ff6174",
                    fillOpacity: .8
                }
            )
            .bindPopup(
                `
            <strong>
                ${anomaly.label}
            </strong>
            <br>
            Anomaly Index:
            ${anomaly.score}/100
            `
            )
            .addTo(newMap);

    });


    /* CURRENT SENSOR */

    L.marker(
            sensorPath[sensorPath.length - 1]
        )
        .bindPopup(
            `
        <strong>Nīra-Garbha NG-SF-001</strong>
        <br>
        Current Sensor Position
        <br>
        Depth: 3842.6 m
        `
        )
        .addTo(newMap);


    return newMap;

}


setTimeout(() => {

    map =
        createMap("map");

    map2 =
        createMap("map2");

}, 100);


/* ============================================
   LIVE SENSOR DATA
============================================ */

function randomValue(
    value,
    variation
) {

    return (
        value +
        (Math.random() - .5) *
        variation
    ).toFixed(2);

}


function updateSensorData() {

    $("depthValue").innerText =
        randomValue(
            3842.6,
            .8
        );


    $("magneticValue").innerText =
        randomValue(
            48.73,
            .25
        );


    $("conductivityValue").innerText =
        randomValue(
            3.86,
            .06
        );


    $("temperatureValue").innerText =
        randomValue(
            2.84,
            .04
        );


    $("pressureValue").innerText =
        randomValue(
            385.1,
            .5
        );


    $("anomalyValue").innerText =
        Math.round(
            72 +
            (Math.random() - .5) * 8
        );


    $("magX").innerText =
        randomValue(
            12.41,
            .3
        );


    $("magY").innerText =
        randomValue(
            -31.18,
            .3
        );


    $("magZ").innerText =
        randomValue(
            35.22,
            .3
        );


    $("emiValue").innerText =
        randomValue(
            18.7,
            .8
        );

}


setInterval(
    updateSensorData,
    1500
);


/* ============================================
   SURVEY DATA
============================================ */

const surveyData = [];


for (
    let i = 0; i < 25; i++
) {

    const position =
        sensorPath[
            i % sensorPath.length
        ];


    surveyData.push({

        id: i + 1,

        time: "00:" +
            String(
                10 +
                Math.floor(i / 2)
            ).padStart(2, "0") +
            ":" +
            String(
                (i * 13) % 60
            ).padStart(2, "0"),

        latitude: Math.abs(
                position[0]
            ).toFixed(4) +
            " S",

        longitude: position[1].toFixed(4) +
            " E",

        depth: (
            3800 +
            i * 2.4
        ).toFixed(1),

        magnetic: (
            47.8 +
            i * .08
        ).toFixed(2),

        emi: (
            15 +
            i * .6
        ).toFixed(1),

        priority: i % 7 === 0 ?
            "HIGH" : i % 3 === 0 ?
            "MEDIUM" : "LOW"

    });

}


/* ============================================
   DATA TABLE
============================================ */

function renderDataTable(
    data
) {

    $("dataTable").innerHTML =
        data.map(row => {

            return `

            <tr>

                <td>${row.id}</td>

                <td>${row.time}</td>

                <td>${row.latitude}</td>

                <td>${row.longitude}</td>

                <td>${row.depth}</td>

                <td>${row.magnetic}</td>

                <td>${row.emi}</td>

                <td>
                    ${row.priority}
                </td>

            </tr>

            `;

        }).join("");

}


renderDataTable(
    surveyData
);


/* ============================================
   TELEMETRY TABLE
============================================ */

function renderTelemetry() {

    $("telemetryTable").innerHTML =

        surveyData
        .slice(0, 10)
        .map(row => {

            return `

                <tr>

                    <td>
                        ${row.time}
                    </td>

                    <td>
                        ${row.latitude}
                    </td>

                    <td>
                        ${row.longitude}
                    </td>

                    <td>
                        ${row.depth} m
                    </td>

                    <td>
                        ${row.magnetic}
                    </td>

                    <td>
                        ${row.emi}
                    </td>

                    <td class="good">
                        ${row.priority}
                    </td>

                </tr>

                `;

        })
        .join("");

}


renderTelemetry();


/* ============================================
   SEARCH
============================================ */

$("searchInput")
    .addEventListener(
        "input",
        event => {

            const search =
                event.target.value
                .toLowerCase();


            const filtered =
                surveyData.filter(
                    row =>
                    Object
                    .values(row)
                    .join(" ")
                    .toLowerCase()
                    .includes(search)
                );


            renderDataTable(
                filtered
            );

        }
    );


/* ============================================
   CSV DOWNLOAD
============================================ */

$("downloadButton")
    .addEventListener(
        "click",
        () => {

            let csv =
                "ID,Time,Latitude,Longitude,Depth,Magnetic,EMI,Priority\n";


            surveyData.forEach(row => {

                csv +=
                    `${row.id},` +
                    `${row.time},` +
                    `${row.latitude},` +
                    `${row.longitude},` +
                    `${row.depth},` +
                    `${row.magnetic},` +
                    `${row.emi},` +
                    `${row.priority}\n`;

            });


            const blob =
                new Blob(
                    [csv], {
                        type: "text/csv"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "niragarbha_survey_data.csv";

            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Survey CSV downloaded"
            );

        }
    );


/* ============================================
   MARK POSITION
============================================ */

$("markPosition")
    .addEventListener(
        "click",
        () => {

            const now =
                new Date()
                .toLocaleTimeString();

            $("eventLog")
                .insertAdjacentHTML(
                    "afterbegin",

                    `
                    <div>

                        <time>
                            ${now}
                        </time>

                        <p>
                            Current sensor
                            position manually marked.
                        </p>

                    </div>
                    `
                );


            showToast(
                "Current position marked"
            );

        }
    );


/* ============================================
   MISSION CONTROLS
============================================ */

$("missionButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Mission is active"
            );

        }
    );


$("surveyButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "New survey line started"
            );

        }
    );


$("pauseButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Sensor logging paused"
            );

        }
    );


$("recoveryButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Recovery mode activated"
            );

        }
    );


/* ============================================
   EXPORT
============================================ */

$("exportButton")
    .addEventListener(
        "click",
        () => {

            $("downloadButton")
                .click();

        }
    );


/* ============================================
   SYSTEM SETTINGS
============================================ */

$("saveSettings")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Sensor configuration saved"
            );

        }
    );


$("testLink")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Communication link: 86% signal"
            );

        }
    );


/* ============================================
   THEME
============================================ */

$("themeButton")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );

        }
    );


/* ============================================
   LIVE GRAPH
============================================ */

const canvas =
    $("signalChart");

const ctx =
    canvas.getContext("2d");


function drawChart() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    ctx.scale(
        ratio,
        ratio
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* GRID */

    ctx.strokeStyle =
        "#173746";

    ctx.lineWidth = 1;


    for (
        let y = 30; y < height; y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }


    /* SIGNAL */

    const points = [];


    for (
        let i = 0; i < 100; i++
    ) {

        let value =

            height / 2 +

            Math.sin(
                i * .22
            ) * 25 +

            (Math.random() - .5) *
            15;


        if (
            i > 68 &&
            i < 80
        ) {

            value -= 50;

        }


        points.push(
            value
        );

    }


    ctx.beginPath();


    points.forEach(
        (value, index) => {

            const x =
                index *
                width /
                (points.length - 1);


            if (index === 0) {

                ctx.moveTo(
                    x,
                    value
                );

            } else {

                ctx.lineTo(
                    x,
                    value
                );

            }

        }
    );


    ctx.strokeStyle =
        "#27d7e8";

    ctx.lineWidth = 2;

    ctx.stroke();

}


setTimeout(
    drawChart,
    200
);


window.addEventListener(
    "resize",
    drawChart
);


/* ============================================
   MINERALS STATUS INTERACTION
============================================ */

document.querySelectorAll(".mineral-card").forEach(card => {
    card.addEventListener("click", () => {
        const name = card.getAttribute("data-mineral") || "Mineral Parameter";
        showToast(`${name}: Static baseline active (Hardware Sensor Offline)`);
    });
});


/* ============================================
   COLLAPSIBLE SIDEBAR TOGGLE
============================================ */

function initSidebarToggle() {
    const sidebarToggleBtn = $("sidebarToggle");
    const topbarSidebarToggleBtn = $("topbarSidebarToggle");

    function toggleSidebar() {
        document.body.classList.toggle("sidebar-collapsed");
        const isCollapsed = document.body.classList.contains("sidebar-collapsed");
        localStorage.setItem("sidebarCollapsed", isCollapsed ? "true" : "false");
        
        // Trigger chart & map redraw to fit new width smoothly
        setTimeout(() => {
            if (typeof drawChart === "function") drawChart();
            if (typeof map !== "undefined" && map) map.invalidateSize();
            if (typeof map2 !== "undefined" && map2) map2.invalidateSize();
        }, 320);
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (topbarSidebarToggleBtn) {
        topbarSidebarToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Keyboard shortcut (Ctrl + B) to toggle sidebar
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // Restore saved state
    if (localStorage.getItem("sidebarCollapsed") === "true") {
        document.body.classList.add("sidebar-collapsed");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
} else {
    initSidebarToggle();
}