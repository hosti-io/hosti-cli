import {HashProviderService} from "../HashProviderService";
import {readFile} from "fs/promises";

test('FS Storage Provider Saving', async () => {
    const hashService = new HashProviderService();
    const fileObject = await readFile('./tslint.json');
    const file = new File([fileObject], "test");
    const hash = await hashService.fileHash(file);
    expect(hash).not.toBeNull();
    expect(hash).not.toBe("");
});

