Copy-Item "src\components\PortalHeader.tsx" "src\components\PortalHeader.tsx.backup-541" -Force

$path = "src\components\PortalHeader.tsx"
$content = Get-Content $path -Raw

$old = '                alt="Priya Sharma Profile"'
$new = '                alt={user?.fullName ? $${user.fullName} Profile : "Profile"}'
$content = $content.Replace($old, $new)

$old = '                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWdkYsbn4v3SZOnwenxTYtPiiIaiXrO9xGsg1JLh26LMo9XWwgtNmz67inZvdkHJStWzdlDVyBBVrjrtJkl1SmuU7FUpTJB45ALBB0TJNgotmsEoOleOZlWxYHD1tgIsCrR66LHXC2cAyOCObeB-kr2IbeKjKdm0cW9CaFMS4Z4ywHfwp_Zp8NKbYphZ63xQDIPUeGVcldvYv1wjNFhkRvBt639QbXhNoEoNA6UQQX6dSn7PBGz7GMVg"'
$new = '                src={user?.avatarUrl || "https://api.dicebear.com/9.x/initials/svg?seed=$${encodeURIComponent(user?.fullName || "User")}"}'
$content = $content.Replace($old, $new)

$old = '                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Priya Sharma</span>'
$new = '                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">{user?.fullName || "User"}</span>'
$content = $content.Replace($old, $new)

$old = '                <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa]">Ops Manager</span>'
$new = '                <span className="text-[10px] text-[#64748B] dark:text-[#a1a1aa]">{user?.role || "Operations Officer"}</span>'
$content = $content.Replace($old, $new)

$old = '                  <p className="text-xs font-bold text-[#0b1c30] dark:text-white">Priya Sharma</p>'
$new = '                  <p className="text-xs font-bold text-[#0b1c30] dark:text-white">{user?.fullName || "User"}</p>'
$content = $content.Replace($old, $new)

$old = "                  <p className="text-[11px] text-[#64748B] dark:text-[#a1a1aa] truncate">
                    priya.sharma@nagarkot.com
                  </p>"
$new = "                  <p className="text-[11px] text-[#64748B] dark:text-[#a1a1aa] truncate">
                    {user?.email || ""}
                  </p>"
$content = $content.Replace($old, $new)

$old = "                    AEO Officer #N-881"
$new = "                    {user?.officerCode ? "AEO Officer #$${user.officerCode}" : (user?.role || 'Operations Officer')}"
$content = $content.Replace($old, $new)

$content | Set-Content -Encoding UTF8 $path
