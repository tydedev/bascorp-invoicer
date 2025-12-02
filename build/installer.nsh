!macro customHeader
  !define MUI_HEADERIMAGE
  !define MUI_HEADERIMAGE_BITMAP "${BUILD_RESOURCES_DIR}\header.bmp"
  !define MUI_HEADERIMAGE_RIGHT
!macroend

!macro customWelcomePage
  !undef MUI_WELCOMEFINISHPAGE_BITMAP
  !define MUI_WELCOMEFINISHPAGE_BITMAP "${BUILD_RESOURCES_DIR}\sidebar.bmp"
  !insertmacro MUI_PAGE_WELCOME
!macroend


; -------- UNINSTALLER --------

!macro customUnHeader
  !define MUI_UNHEADERIMAGE
  !define MUI_UNHEADERIMAGE_BITMAP "${BUILD_RESOURCES_DIR}\header.bmp"
  !define MUI_UNHEADERIMAGE_RIGHT
!macroend

!macro customUnWelcomePage
  !undef MUI_UNWELCOMEFINISHPAGE_BITMAP
  !define MUI_UNWELCOMEFINISHPAGE_BITMAP "${BUILD_RESOURCES_DIR}\sidebar.bmp"
  !insertmacro MUI_UNPAGE_WELCOME
!macroend
