/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, CustomSelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function UpdatedTimeEdit( {
	attributes: { textAlign, format, content },
	context: { postId, postType },
	setAttributes,
} ) {
	const [ siteFormat ] = useEntityProp( 'root', 'site', 'date_format' );
	const [ date ] = useEntityProp( 'postType', postType, 'date', postId );
	const settings = __experimentalGetSettings();
	const formatOptions = Object.values( settings.formats ).map(
		( formatOption ) => ( {
			key: formatOption,
			name: dateI18n( formatOption, date ),
		} )
	);
	const resolvedFormat = format || siteFormat || settings.formats.date;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const postDate = date ? (
		<time dateTime={ dateI18n( 'c', date ) }>
			{ dateI18n( resolvedFormat, date ) }
		</time>
	) : (
		__( 'No Date' )
	);

	function onChange( attribute ) {
		return ( newValue ) => {
			setAttributes( { [ attribute ]: newValue } );
		};
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Format settings' ) }>
					<CustomSelectControl
						hideLabelFromVision
						label={ __( 'Date Format' ) }
						options={ formatOptions }
						onChange={ ( { selectedItem } ) =>
							setAttributes( {
								format: selectedItem.key,
							} )
						}
						value={ formatOptions.find(
							( option ) => option.key === resolvedFormat
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<RichText
					identifier="content"
					multiline={ false }
					tagName="span"
					value={ content }
					onChange={ onChange( 'content' ) }
					aria-label={ __( 'Updated' ) }
					placeholder={ __( 'Updated', 'updated-time-block' ) }
					allowedFormats={ [] }
					withoutInteractiveFormatting
					data-empty={ content ? false : true }
					__unstableMobileNoFocusOnMount
				/>
				&nbsp;
				{ postDate }
			</div>
		</>
	);
}
