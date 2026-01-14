"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = componentTagger;
const parser_1 = require("@babel/parser");
const magic_string_1 = require("magic-string");
const estree_walker_1 = require("estree-walker");
const path = require("path");

const threeFiberElems = ["object3D", "mesh", "group", "scene", "perspectiveCamera"];
const dreiElems = ["OrbitControls", "Html", "Text"];
const shouldTag = (name) => !threeFiberElems.includes(name) && !dreiElems.includes(name);

const isNextImageAlias = (aliases, name) => aliases.has(name);

function componentTagger(src, map) {
    const done = this.async();
    try {
        if (/node_modules/.test(this.resourcePath))
            return done(null, src, map);
        if (!/\.(jsx|tsx)$/.test(this.resourcePath))
            return done(null, src, map);

        const ast = (0, parser_1.parse)(src, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        });
        const ms = new magic_string_1.default(src);
        const rel = path.relative(process.cwd(), this.resourcePath);
        let mutated = false;

        (0, estree_walker_1.walk)(ast, {
            enter(node) {
                if (node.type !== 'JSXOpeningElement')
                    return;

                const getName = (n) => {
                    if (n.type === 'JSXIdentifier') return n.name;
                    if (n.type === 'JSXMemberExpression') return `${n.object.name}.${n.property.name}`;
                    return null;
                };

                const semanticName = getName(node.name);
                if (!semanticName || !shouldTag(semanticName)) return;

                const { line, column } = node.loc.start;
                const orchidsId = `${rel}:${line}:${column}`;

                ms.appendLeft(node.name.end, ` data-orchids-id="${orchidsId}" data-orchids-name="${semanticName}"`);
                mutated = true;
            },
        });

        if (!mutated)
            return done(null, src, map);
        
        const out = ms.toString();
        const outMap = ms.generateMap({ hires: true });
        done(null, out, JSON.stringify(outMap));
    }
    catch (err) {
        done(err);
    }
}
