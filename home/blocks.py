from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock
from wagtail.images.models import Image
from django.template.loader import render_to_string
import json
class ButtonBlock(blocks.StructBlock):
    """A single call-to-action button."""
    text = blocks.CharBlock(required=True, max_length=50, help_text="Button text")
    url = blocks.URLBlock(required=True, help_text="The URL the button will link to")
    class_str = blocks.CharBlock(default='is-primary', required=False, max_length=100, help_text="Bulma CSS classes for styling (e.g., 'is-primary', 'is-light is-outlined')")

    class Meta:
        template = None # No template needed, rendered within the HeroBlock template
        icon = 'link'
        label = 'Button'

class HeroBlock(blocks.StructBlock):
    """
    A full-width hero section with a title, subtitle, background image, and buttons.
    """
    hero_title = blocks.CharBlock(required=True, max_length=100, help_text="The main title for the hero section.")
    hero_subtitle = blocks.TextBlock(required=False, help_text="The subtitle that appears below the main title.")
    hero_image = ImageChooserBlock(required=True, help_text="The background image for the hero section.")
    hero_buttons = blocks.ListBlock(
        ButtonBlock(),
        min_num=0,
        max_num=2,
        help_text="Add up to two call-to-action buttons."
    )

    class Meta:
        template = 'blocks/hero.html'
        icon = 'media'
        label = 'Hero Section'

class MissionPointBlock(blocks.StructBlock):
    """A single point for the mission/vision section, with a title and description."""
    title = blocks.CharBlock(required=True, max_length=100, help_text="The title of the point (e.g., Education)")
    description = blocks.TextBlock(required=True, help_text="The description for the point.")
    # icon = blocks.CharBlock(required=False, help_text="Lucide icon name (e.g., Users, Target, Handshake)")

    class Meta:
        icon = 'tag'
        label = 'Mission Point'

class MissionVisionBlock(blocks.StructBlock):
    """
    A block to display a series of mission points.
    """
    points = blocks.ListBlock(
        MissionPointBlock(),
        help_text="Add mission points to display."
    )

    class Meta:
        template = "blocks/mission_vision.html"
        icon = "list-ul"
        label = "Mission Points"

class ProgramCardBlock(blocks.StructBlock):
    """A single program card."""
    title = blocks.CharBlock(required=True, max_length=100, help_text="The title of the program.")
    short_description = blocks.RichTextBlock(required=True, help_text="A short description of the program.")
    image = ImageChooserBlock(required=True, help_text="The image for the program card.")
    page = blocks.PageChooserBlock(required=True, help_text="The page to link to for this program.")

    class Meta:
        icon = 'doc-full'
        label = 'Program Card'

class FeaturedProgramsBlock(blocks.StructBlock):
    """
    A section to display featured programs.
    """
    title = blocks.CharBlock(required=True, max_length=100, default="Featured Programs", help_text="The title of the section.")
    subtitle = blocks.TextBlock(required=False, help_text="The subtitle for the section.")
    programs = blocks.ListBlock(
        ProgramCardBlock(),
        help_text="Add program cards to display."
    )
    see_all_button_text = blocks.CharBlock(default="See All Programs", required=True, max_length=50, help_text="Text for the 'See All Programs' button.")
    see_all_button_page = blocks.PageChooserBlock(required=True, help_text="The page to link to for the 'See All Programs' button.")

    class Meta:
        template = "blocks/featured_programs.html"
        icon = "folder-open-inverse"
        label = "Featured Programs"
