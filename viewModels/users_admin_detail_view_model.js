'use strict'

/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2022*/
/**
 * Users V View Model
 *
 * @copyright 2022 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

module.exports = function (entity, pageName='', success, error, base_url = "" ) {

  this.entity = entity

  this.success = success || null
  this.error = error || null

  this._base_url  = base_url

  this.endpoint = "/admin/users"

  this.get_page_name = () => pageName

  this.heading = "User details"


  this.detail_fields = {"id":"","role_id":"","email":"","first_name":"","last_name":"","photo":"","phone":"","verify":"","status":""}


  return this;
}
