// Copyright 2019 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { join } from 'node:path';
import type { SpawnOptions } from 'node:child_process';
import { spawn as spawnEmitter } from 'node:child_process';
import { readdir as readdirCallback, unlink as unlinkCallback } from 'node:fs';

import { app } from 'electron';
import pify from 'pify';

import { Updater } from './common.js';

const readdir = pify(readdirCallback);
const unlink = pify(unlinkCallback);

const IS_EXE = /\.exe$/i;

export class WindowsUpdater extends Updater {
  #installing = false;

  // This is fixed by our new install mechanisms...
  //   https://github.com/signalapp/Signal-Desktop/issues/2369
  // ...but we should also clean up those old installers.
  protected async deletePreviousInstallers(): Promise<void> {
    const userDataPath = app.getPath('userData');
    const files: Array<string> = await readdir(userDataPath);
    await Promise.all(
      files.map(async file => {
        const isExe = IS_EXE.test(file);
        if (!isExe) {
          return;
        }

        const fullPath = join(userDataPath, file);
        try {
          await unlink(fullPath);
        } catch (error) {
          this.logger.error(
            `deletePreviousInstallers: couldn't delete file ${file}`
          );
        }
      })
    );
  }
  protected async installUpdate(
    updateFilePath: string,
    isSilent: boolean
  ): Promise<() => Promise<void>> {
    console.log('in windows.ts, skip method installUpdate()');
    return;
  }

  protected restart(): void {
    console.log('in windows.ts, skip method restart()');
    return;
  }

  async #install(filePath: string, isSilent: boolean): Promise<void> {
    console.log('in windows.ts, skip method #install()');
    return;
  }
}

// Helpers

function getElevatePath() {
  const installPath = app.getAppPath();

  return join(installPath, 'resources', 'elevate.exe');
}

async function spawn(
  exe: string,
  args: Array<string>,
  options: SpawnOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const emitter = spawnEmitter(exe, args, options);
    emitter.on('error', reject);
    emitter.unref();

    setTimeout(resolve, 200);
  });
}
