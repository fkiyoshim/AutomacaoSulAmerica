const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const shell = require('shelljs');

function getFiles(dir, ext, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = `${dir}/${file}`;
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (path.extname(file) === ext) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function traverseAndModifyTimedOut(target, deep) {
    if (target['tests'] && target['tests'].length) {
        target['tests'].forEach(test => {
            test.timedOut = false;
        });
    }
    if (target['suites']) {
        target['suites'].forEach(suite => {
            traverseAndModifyTimedOut(suite, deep + 1);
        })
    }
}

function combineMochaAwesomeReports() {
    const reportDir = path.join(__dirname, '..', 'mochawesome-report');
    const reports = getFiles(reportDir, '.json', []);
    const suites = [];
    let totalSuites = 0;
    let totalTests = 0;
    let totalPasses = 0;
    let totalFailures = 0;
    let totalPending = 0;
    let startTime;
    let endTime;
    let totalskipped = 0;
    reports.forEach((report, idx) => {
        const rawdata = fs.readFileSync(report);
        const parsedData = JSON.parse(rawdata);
        if (idx === 0) {
            startTime = parsedData.stats.start;
        }
        if (idx === (reports.length - 1)) {
            endTime = parsedData.stats.end;
        }
        totalSuites += parseInt(parsedData.stats.suites, 10);
        totalskipped += parseInt(parsedData.stats.skipped, 10);
        totalPasses += parseInt(parsedData.stats.passes, 10);
        totalFailures += parseInt(parsedData.stats.failures, 10);
        totalPending += parseInt(parsedData.stats.pending, 10);
        totalTests += parseInt(parsedData.stats.tests, 10);

        if (parsedData && parsedData.suites && parsedData.suites.suites) {
            parsedData.suites.suites.forEach(suite => {
                suites.push(suite)
            })
        }
    });
    return {
        totalSuites,
        totalTests,
        totalPasses,
        totalFailures,
        totalPending,
        startTime,
        endTime,
        totalskipped,
        suites,
    };
}

function getPercentClass(pct) {
    if (pct <= 50) {
        return 'danger';
    } else if (pct > 50 && pct < 80) {
        return 'warning';
    }
    return 'success';
}


const uuid = uuidv1();
const obj = combineMochaAwesomeReports();

const dirGenerated = path.resolve(__dirname, 'generated');
if (!fs.existsSync(dirGenerated)) {
    fs.mkdir(dirGenerated);
}

const sampleFile = path.join(__dirname, 'report.json');
const outFile = path.join(__dirname, '..', `/report/generated/${uuid}.json`);

fs.readFile(sampleFile, 'utf8', (err, data) => {
    if (err) throw err;
    const parsedSampleFile = JSON.parse(data);
    const stats = parsedSampleFile.stats;
    stats.suites = obj.totalSuites;
    stats.tests = obj.totalTests;
    stats.passes = obj.totalPasses;
    stats.failures = obj.totalFailures;
    stats.pending = obj.totalPending;
    stats.start = obj.startTime;
    stats.end = obj.endTime;
    stats.duration = new Date(obj.endTime) - new Date(obj.startTime);
    stats.testsRegistered = obj.totalTests - obj.totalPending;
    stats.passPercent = Math.round((stats.passes / (stats.testsRegistered - stats.pending)) * 1000) / 10;
    stats.pendingPercent = Math.round((stats.pending / stats.testsRegistered) * 1000) / 10;
    stats.skipped = obj.totalskipped;
    stats.hasSkipped = obj.totalskipped > 0;
    stats.passPercentClass = getPercentClass(stats.passPercent);
    stats.pendingPercentClass = getPercentClass(stats.pendingPercent);

    obj.suites.forEach(suit => {
        traverseAndModifyTimedOut(suit, 0);
    });

    parsedSampleFile.suites.suites = obj.suites;
    parsedSampleFile.suites.uuid = uuid;
    fs.writeFile(outFile, JSON.stringify(parsedSampleFile), {flag: 'wx'}, (error) => {
        if (error) throw error;
    });
});

shell.exec(`./node_modules/.bin/marge report/generated/${uuid}.json  --reportDir report/generated`, (code, stdout, stderr) => {
    if (stderr) throw stderr;
});

// Clean last report genered
if (fs.existsSync('report')) {
    shell.exec(`rm -rf report/generated/*`, (code, stdout, stderr) => {
        if (stderr) throw stderr;
    });
}

// Move screenshot folder
if (fs.existsSync('screenshots')) {
    shell.exec(`mv screenshots/*.feature/* screenshots/ && rm -rf screenshots/*.feature && mv screenshots/ report/generated/`, (code, stdout, stderr) => {
        if (stderr) throw stderr;
    });
}

// Clean *.json
if (fs.existsSync('mochawesome-report')) {
    shell.exec(`rm -rf mochawesome-report/*`, (code, stdout, stderr) => {
        if (stderr) throw stderr;
    });
}