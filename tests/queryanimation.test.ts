import { JSDOM } from 'jsdom'
import { Query } from '../src/lib/animations.js'
import { AnimationQuery } from '../src/lib/types.js'
import { expect, test } from 'vitest'
// import walkdir from 'walkdir'
// import { readFileSync, writeFileSync } from 'fs'
// import path from 'path'

test('reads animation file', () => {
	const dom = new JSDOM(GREATAXE_ANIMATION, {
		contentType: "text/xml"
	})
	const tagDef = dom.window.document.querySelector('AnimDB')?.getAttribute('TagDef')
	expect(tagDef).toBe('Animations/Mannequin/ADB/Player/PlayerMaleTags.xml')
})

test('parses fragment list', () => {
	const dom = new JSDOM(GREATAXE_ANIMATION, {
		contentType: "text/xml"
	})
	const query: AnimationQuery = {
		fragment: {
			proclayer: {
				procedural: {
					params: {
						name: 'cantransition',
					}
				}
			}
		}
	}

	const result = Query(dom.window.document, query)
	expect(result[0]?.Fragments?.[0]?.ProcLayers?.[0]?.[0]?.ProceduralParams?.Name).toBe('CanTransition')
})

// test('read file', () => {
// 	const emitter = walkdir('E:/Extract/NW Live/animations/mannequin/adb/npc_commander_1h_swordanims.adb')
// 	emitter.on('file', (filename, stat) => {
// 		console.log(filename)
// 		const file = readFileSync(filename, { encoding: 'utf8' })
// 		const dom = new JSDOM(file, {
// 			contentType: 'text/xml'
// 		})
// 		const result = Query(dom.window.document)
// 		writeFileSync('./output/' + path.basename(filename) + '.json', JSON.stringify(result))
// 		console.log(result)
// 	})
// })

const GREATAXE_ANIMATION = `
  <AnimDB FragDef="animations/Mannequin/ADB/Player/PlayerMaleActions.xml" TagDef="Animations/Mannequin/ADB/Player/PlayerMaleTags.xml">
		<FragmentList>
			<Ability_GreatAxe_Maelstrom>
				<Fragment BlendOutDuration="0.2" Tags="2H_Melee+GreatAxe">
					<ProcLayer>
						<Blend ExitTime="0.86666667" StartTime="0" Duration="0" CurveType="0"/>
						<Procedural type="CAGE-Named" contextType="NamedContext">
							<ProceduralParams>
								<Name value="CanTransition"/>
							</ProceduralParams>
						</Procedural>
					</ProcLayer>
					<ProcLayer>
						<Blend ExitTime="0.36669999" StartTime="0" Duration="0" CurveType="0"/>
						<Procedural type="CAGE-Named" contextType="NamedContext">
							<ProceduralParams>
								<Name value="CanDodgeBuffer"/>
							</ProceduralParams>
						</Procedural>
						<Blend ExitTime="0.46663332" StartTime="0" Duration="0" CurveType="0"/>
						<Procedural type="CAGE-Named" contextType="NamedContext">
							<ProceduralParams>
								<Name value="CanDodgeCancel"/>
							</ProceduralParams>
						</Procedural>
					</ProcLayer>
				</Fragment>
			</Ability_GreatAxe_Maelstrom>
			<Ability_GreatAxe_Executioner>
				<Fragment BlendOutDuration="0.2" Tags="2H_Melee+GreatAxe">
					<ProcLayer>
						<Blend ExitTime="0.66666669" StartTime="0" Duration="0" CurveType="0"/>
						<Procedural type="CAGE-Damage" contextType="DamageContext">
							<ProceduralParams>
								<DamageKey value="Atk1"/>
								<DamageTableRow value="GreatAxe_Executioner"/>
								<DamageSelf value="false"/>
								<ScaleX value="0"/>
								<ScaleY value="0"/>
								<ScaleZ value="0"/>
								<OffsetX value="0"/>
								<OffsetY value="0"/>
								<OffsetZ value="0"/>
								<MeleeAttackShapeCastType value="MeleeAttackShapeCastTypeCapsule"/>
								<MeleeAttackShapeRadius value="0.34999999"/>
								<MeleeAttackCapsuleHalfHeight value="0.75"/>
								<MeleeAttackBoxDimensionsX value="0"/>
								<MeleeAttackBoxDimensionsY value="0"/>
								<MeleeAttackBoxDimensionsZ value="0"/>
								<JointName value="master_root"/>
								<UseOffhandWeapon value="false"/>
								<OverrideWeaponSlotAlias value="false"/>
								<xRotationOffset value="0"/>
								<yRotationOffset value="0"/>
								<zRotationOffset value="0"/>
								<AmmoSlotForScaling value=""/>
								<ShapeAxesModifierCommands value=""/>
								<DisableLOSCheck value="false"/>
								<UseEndAsCenter value="false"/>
								<UseMaxEnvironmentImpactAngle value="true"/>
								<UseCameraPitch value="false"/>
								<takeDurability value="true"/>
								<takeDurabilityOnUse value="false"/>
								<Condition value=""/>
								<PulseLength value="0"/>
								<AffectAlliesOnly value="false"/>
								<IntervalLength value="0"/>
							</ProceduralParams>
						</Procedural>
						<Blend ExitTime="0.099999964" StartTime="0" Duration="8.7946653e-05" CurveType="0"/>
						<Procedural type="" contextType=""/>
					</ProcLayer>
				</Fragment>
			</Ability_GreatAxe_Executioner>
		</FragmentList>
  </AnimDB>
`
