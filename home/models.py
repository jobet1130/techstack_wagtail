from django.db import models
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail import blocks as wagtail_blocks
from wagtail.models import Page
from .blocks import *

class HomePage(Page):
    subtitle = models.CharField(max_length=255, blank=True, null=True, help_text="A subtitle for the home page")
    
    body = StreamField([
        ('hero', HeroBlock()),
        ('paragraph',wagtail_blocks.RichTextBlock(
            icon='pilcrow',
            template="blocks/rich_text_block.html"
        )),
    ], use_json_field=True, null=True, blank=True)

    mission_vision = StreamField([
        ('mission_vision', MissionVisionBlock()),
    ], use_json_field=True, null=True, blank=True, help_text="The mission and vision section")

    featured_programs = StreamField([
        ('featured_programs', FeaturedProgramsBlock()),
    ], use_json_field=True, null=True, blank=True, help_text="The featured programs section")

    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('body'),
        FieldPanel('mission_vision'),
        FieldPanel('featured_programs'),
    ]

    class Meta(Page.Meta):
        verbose_name = "Home Page"
        verbose_name_plural = "Home Pages"
