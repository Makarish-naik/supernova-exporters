import { CSSHelper, TokenToCSSOptions } from './CSSHelper'
import { Token, TokenType } from '@supernovaio/sdk-exporters'

export type TokenToSCSSOptions = TokenToCSSOptions & {
  /** Whether to use SCSS nesting */
  useNesting?: boolean
  /** Whether to use SCSS mixins */
  useMixins?: boolean
  /** Prefix for SCSS mixins */
  mixinPrefix?: string
  /** Whether to generate SCSS maps */
  generateMaps?: boolean
  /** Map name prefix */
  mapNamePrefix?: string
}

export class SCSSHelper extends CSSHelper {
  static tokenToSCSS(
    token: Token,
    allTokens: Map<string, Token>,
    options: TokenToSCSSOptions
  ): string {
    const cssValue = super.tokenToCSS(token, allTokens, options)
    
    // Handle SCSS-specific transformations
    if (options.useMixins && token.tokenType === TokenType.color) {
      const mixinName = `${options.mixinPrefix || 'theme'}-${token.name.replace(/[^a-zA-Z0-9]/g, '-')}`
      return `@include ${mixinName} { ${cssValue} }`
    }
    
    return cssValue
  }

  static generateSCSSVariable(
    token: Token,
    value: string,
    options: TokenToSCSSOptions
  ): string {
    const variableName = `$${token.name.replace(/[^a-zA-Z0-9]/g, '-')}`
    return `${variableName}: ${value};`
  }

  static generateSCSSMap(
    tokens: Token[],
    options: TokenToSCSSOptions
  ): string {
    const mapName = `${options.mapNamePrefix || 'theme'}-map`
    const mapEntries = tokens.map(token => {
      const key = `'${token.name}'`
      const value = this.tokenToSCSS(token, new Map(), options)
      return `${key}: ${value}`
    })
    return `$${mapName}: (${mapEntries.join(', ')});`
  }

  static generateSCSSMixin(
    token: Token,
    value: string,
    options: TokenToSCSSOptions
  ): string {
    const mixinName = `${options.mixinPrefix || 'theme'}-${token.name.replace(/[^a-zA-Z0-9]/g, '-')}`
    return `@mixin ${mixinName} { ${value} }`
  }
}