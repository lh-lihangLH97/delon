import { Rule, chain } from '@angular-devkit/schematics';
import { sync as globSync } from 'glob';
import { TargetVersion } from './target-version';
import { createUpgradeRule } from './upgrade-rules';
import { UpgradeTSLintConfig } from './upgrade-rules/tslint-config';
import { delonUpgradeData } from './upgrade-data';
import { v2LayoutRule } from './upgrade-rules/v2/v2LayoutRule';
import { v2DomRule } from './upgrade-rules/v2/v2DomRule';

/** List of additional upgrade rules which are specifically for the CDK. */
const extraUpgradeRules = [
  // Misc check rules
  'check-property-names-misc',
];

const ruleDirectories = globSync('upgrade-rules/**/', {
  cwd: __dirname,
  absolute: true,
});

/** TSLint upgrade configuration that will be passed to the CDK ng-update rule. */
const tslintUpgradeConfig: UpgradeTSLintConfig = {
  upgradeData: delonUpgradeData,
  extraRuleDirectories: ruleDirectories,
  extraUpgradeRules,
};

export function updateToV2(): Rule {
  return chain([
    v2LayoutRule,
    v2DomRule,
    createUpgradeRule(TargetVersion.V2, tslintUpgradeConfig)
  ]);
}

export function postUpdate(): Rule {
  return () =>
    console.log(
      '\nComplete! Please check the output above for any issues that were detected but could not' +
        ' be automatically fixed.',
    );
}
