/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	RichText,
	__experimentalDateFormatPicker as DateFormatPicker,
} from '@wordpress/block-editor';
import {
	dateI18n,
	__experimentalGetSettings as getDateSettings,
} from '@wordpress/date';
import { PanelBody, DateTimePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function UpdatedTimeEdit( {
	attributes: { textAlign, format, content },
	context: { postId, postType: postTypeSlug, queryId },
	setAttributes,
} ) {

	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const timeRef = useRef();
        const dateSettings = getDateSettings();
        const [ siteFormat = dateSettings.formats.date ] = useEntityProp(
		'root',
		'site',
		'date_format'
	);
	const [ date ] = useEntityProp(
		'postType',
		postTypeSlug,
		'date',
		postId
	);

	let postDate = date ? (
		<time dateTime={ dateI18n( 'c', date ) } ref={ timeRef }>
			{ dateI18n( format || siteFormat, date ) }
		</time>
	) : (
		__( 'Post Date' )
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
				<PanelBody title={ __( 'Settings' ) }>
					<DateFormatPicker
						format={ format }
						defaultFormat={ siteFormat }
						onChange={ ( nextFormat ) =>
							setAttributes( { format: nextFormat } )
						}
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
