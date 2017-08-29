import {ClientRenderer} from "../src/client-renderer";

describe('Component test driver', function () {
    const clientRenderer = new ClientRenderer();

    afterEach(function () {
        clientRenderer.cleanup();
    });


});
