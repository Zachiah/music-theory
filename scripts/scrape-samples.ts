import { exec } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os'
import { randomBytes } from 'node:crypto';

const execPromise = promisify(exec)

const SAMPLES_DIR = path.resolve(cwd(), './static/samples')

const INSTRUMENTS = [
    {
        name: 'piano',
        url: 'https://theremin.music.uiowa.edu/mispiano.html',
        urlPattern: /href="(sound files\/[^"]*\.mf\.([a-zA-Z0-9]+)\.aiff)"/g
    },
    // {
    //     name: 'guitar',
    //     url: 'https://theremin.music.uiowa.edu/MISguitar.html',
    //     urlPattern: /href="(sound files\/[^"]*\.mf\.([a-zA-Z0-9])+\.aiff)"/g
    // },
]

const downloadAudio = async (url: string, outputPath: string) => {
    const response = await fetch(url);

    if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const fileStream = createWriteStream(outputPath);

    await pipeline(response.body as unknown as NodeJS.ReadableStream, fileStream);
}

const createTempFile = (ext = "") => {
    const tmpDir = tmpdir();
    const filename = randomBytes(16).toString("hex") + ext;
    const fullPath = path.join(tmpDir, filename);

    return fullPath;
}

const main = async (instrument: typeof INSTRUMENTS[number]) => {
    const res = await fetch(instrument.url);
    const text = await res.text()

    const files = (() => {
        const matches = text
            .matchAll(instrument.urlPattern)

        return Array
            .from(matches)
            .map(m => ({url: new URL(m[1], instrument.url).toString(), note: m[2]}))
    })()

    for (const {url, note} of files) {
        console.log('Processing: ', note)

        const aiffPath = createTempFile('.aiff')
        const mp3Path = path.resolve(SAMPLES_DIR, instrument.name, `${note}.mp3`)
        await downloadAudio(url, aiffPath)

        await execPromise(`ffmpeg -i "${aiffPath}" -q:a 0 "${mp3Path}"`);
    }
}

main(INSTRUMENTS[0])
