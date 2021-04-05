import {HashProviderService} from "../HashProviderService";
import {readFile} from "fs/promises";

test('FS Storage Provider Saving', async () => {
    const hashService = new HashProviderService();
    const hash = await hashService.fileHash('./tslint.json');
    expect(hash).not.toBeNull();
    expect(hash).not.toBe("");
});

