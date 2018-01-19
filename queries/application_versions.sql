SELECT distinct CASE
 WHEN switch_typeid IS NULL THEN application_type
 ELSE switch_type||' '||application_type
 END AS application_type, apptype_id , release, OS, os_type /*, os_version */ FROM (
SELECT a.lc_value AS application_type, a.lc_subtype AS apptype_id , a.version AS release, a.OS, a.os_type, a.os_version, b.switch_typeid,b.switch_type,is_server FROM (
SELECT a.dbid,a.name,a.version,d.name AS host,d.os, d.os_type, d.os_version, b.lc_subtype,b.lc_value,a.state, a.is_server FROM cfg_application a JOIN cfg_locale b
ON a.TYPE=b.lc_subtype
JOIN cfg_server c ON a.dbid=c.app_dbid
JOIN (SELECT a.dbid,a.name, a.os_version, a.os_type, b.lc_value AS os,a.ip_address,  REGEXP_SUBSTR(ip_address,'(\d){1,3}\.(\d){1,3}\.(\d){1,3}') AS subnet, a.lca_port,a.scs_dbid,a.state FROM cfg_host a JOIN cfg_locale b ON a.os_type=b.lc_subtype WHERE b.lc_type=11) d ON c.host_dbid=d.dbid
WHERE b.lc_type=6
) a
left JOIN (
SELECT a."DBID",a."NAME",a."VERSION",a."HOST",a."LC_SUBTYPE",a."LC_VALUE",a."STATE",b.SECTION,b.subsection0,b.subsection_value0,b.subsection1,b.subsection_value1,c.dbid AS switch_dbid,c.tenant_dbid,c.phys_switch_dbid,c.TYPE AS switch_typeid, c.name AS switch_name,c.link_type, c.state AS switch_state,d.lc_value AS switch_type FROM (
SELECT a.dbid,a.name,a.version,d.name AS host,d.os, d.os_type, d.os_version, b.lc_subtype,b.lc_value,a.state, a.is_server FROM cfg_application a JOIN cfg_locale b
ON a.TYPE=b.lc_subtype
JOIN cfg_server c ON a.dbid=c.app_dbid
JOIN (SELECT a.dbid,a.name, a.os_version, a.os_type, b.lc_value AS os,a.ip_address,  REGEXP_SUBSTR(ip_address,'(\d){1,3}\.(\d){1,3}\.(\d){1,3}') AS subnet, a.lca_port,a.scs_dbid,a.state FROM cfg_host a JOIN cfg_locale b ON a.os_type=b.lc_subtype WHERE b.lc_type=11) d ON c.host_dbid=d.dbid
WHERE b.lc_type=6
) a
JOIN
(SELECT * FROM (SELECT a.dbid, a.object_dbid, a.object_type, a.parent_dbid, a.prop_type, a.prop_name AS SECTION, b.prop_name AS subsection0, b.prop_value AS subsection_value0,c.prop_name AS subsection1, c.prop_value AS subsection_value1  FROM cfg_flex_prop a
left JOIN cfg_flex_prop b ON b.parent_dbid=a.dbid
left JOIN cfg_flex_prop c ON c.parent_dbid=b.dbid
) fl  WHERE fl.subsection0 LIKE '%Switch%' AND fl.object_type=9) b ON a.dbid=b.object_dbid
JOIN cfg_switch c ON b.subsection1=TO_CHAR(c.dbid)
JOIN cfg_locale d ON c.TYPE=d.lc_subtype
WHERE b.subsection0 LIKE 'CFGSwitch' AND b.object_type=9  AND d.lc_type=1
) b ON a.dbid=b.dbid
WHERE a.state=1 AND is_server=2 AND a.lc_subtype NOT IN (156,107,82,23,8) GROUP by a.lc_value, a.lc_subtype, a.version, a.OS, a.os_type,a.os_version, b.switch_typeid,b.switch_type,is_server
)
ORDER BY apptype_id,release,os